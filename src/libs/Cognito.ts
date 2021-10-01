import axios, { AxiosInstance } from 'axios';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import { Logger } from './Logger';
import * as jwkToPem from 'jwk-to-pem';
import { ApiTokenExpiredError } from './Errors/ApiTokenExpiredError';
import { ApiTokenInvalidError } from './Errors/ApiTokenInvalidError';
import { ApiTokenError } from './Errors/ApiTokenError';
import * as aws from 'aws-sdk';

const COGNITO_USER_POOL_ID: string = process.env.COGNITO_USER_POOL_ID ?? '';
const COGNITO_REGION: string = process.env.COGNITO_REGION ?? '';
const COGNITO_CLIENT_ID: string = process.env.COGNITO_CLIENT_ID ?? '';
const ISS = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
const verifyPromised = promisify(jwt.verify.bind(jwt));

aws.config.update({
    region: COGNITO_REGION,
    credentials: new aws.CognitoIdentityCredentials({
        IdentityPoolId: COGNITO_USER_POOL_ID,
    }),
});

const AwsCognito = new aws.CognitoIdentityServiceProvider();
interface Claim {
    token_use: string;
    auth_time: number;
    iss: string;
    exp: number;
    username: string;
    client_id: string;
}
interface PublicKeyMeta {
    pem: string;
}

interface CognitoUser {
    username: string;
    email: string;
}

interface Jwk {
    alg: string;
    e: string;
    kid: string;
    kty: string;
    n: string;
    use: string;
}

interface Jwks {
    keys: Jwk[];
}

interface PublicKeys {
    [key: string]: PublicKeyMeta;
}

export class Cognito {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: ISS,
            timeout: 25000, //must be less than 30seconds
        });
    }

    async createUser(username: string, password: string, email: string): Promise<CognitoUser> {
        const signUpParams = {
            ClientId: COGNITO_CLIENT_ID,
            Username: username,
            Password: password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email,
                },
            ],
        };
        await AwsCognito.signUp(signUpParams).promise();
        const confirmParams = {
            UserPoolId: COGNITO_USER_POOL_ID,
            Username: username,
        };
        await AwsCognito.adminConfirmSignUp(confirmParams).promise();
        return {
            username,
            email,
        };
    }

    async login(username: string, password: string): Promise<string> {
        const params = {
            ClientId: process.env.COGNITO_CLIENT_ID,
            UserPoolId: process.env.USER_POOL_ID,
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        };
        const {
            AuthenticationResult: { IdToken: idToken },
        } = await AwsCognito.adminInitiateAuth(params).promise();
        return idToken;
    }

    async getJwks(): Promise<Jwks> {
        try {
            const response = await this.client.get('/.well-known/jwks.json');
            return response.data;
        } catch (error) {
            const { data, status } = error.response;
            Logger.error('Get Public Key error: ', {
                error: { status, data },
            });
            throw data;
        }
    }

    getPublicKey(jwks: Jwks): PublicKeys {
        try {
            return jwks.keys.reduce((agg, current) => {
                const pem = jwkToPem(current);
                agg[current.kid] = { pem };
                return agg;
            }, {} as PublicKeys);
        } catch (error) {
            const { data, status } = error.response;
            Logger.error('Get Public Key error: ', {
                error: { status, data },
            });
            throw data;
        }
    }

    async validateToken(token: string): Promise<Claim> {
        token = token.replace(/^Bearer\s/, '');
        const jwksData = await this.getJwks();
        const pems = this.getPublicKey(jwksData);
        //Fail if the token is not jwt
        const decodedJwt = jwt.decode(token, { complete: true });
        if (!decodedJwt) {
            Logger.error('Cognito Validate Token', { message: 'Not a valid JWT token' });
            throw new ApiTokenInvalidError();
        }

        //Get the kid from the token and retrieve corresponding PEM
        const kid = decodedJwt.header.kid;
        const key = pems[kid];
        if (!key) {
            Logger.error('Cognito Validate Token', { message: 'Invalid access token' });
            throw new ApiTokenInvalidError();
        }

        const claim = (await verifyPromised(token, key.pem)) as Claim;
        const currentSeconds = Math.floor(new Date().valueOf() / 1000);
        if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
            throw new ApiTokenExpiredError();
        }
        if (claim.iss !== ISS) {
            Logger.error('Cognito Validate Token', { message: 'invalid issuer' });
            throw new ApiTokenInvalidError();
        }
        if (claim.token_use !== 'access') {
            Logger.error('Cognito Validate Token', { message: 'Not an access token' });
            throw new ApiTokenError();
        }
        Logger.debug('Cognito Valid Token', claim);
        return claim;
    }
}
