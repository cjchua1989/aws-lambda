import { HttpStatus, Method, Path, StandardResponse } from '../commands/Path';
import * as faker from 'faker';

const METHOD = Method.POST;
const PATH = 'auth';
const TAG = 'PUBLIC';
const DESCRIPTION = 'Authenticate user via email or mobile and password';

interface AuthRequest {
    username: string;
    password: string;
}

export class Auth extends Path {
    constructor() {
        super(METHOD, PATH, TAG, DESCRIPTION);

        this.addBody<AuthRequest>('AuthRequest', {
            DEFAULT: {
                username: faker.internet.email(),
                password: faker.random.alphaNumeric(10),
            },
        });

        this.addResponse(HttpStatus.R422, StandardResponse.PARAMETER_ERROR, 'Parameter Error', {
            DEFAULT: {
                code: 422,
                message: 'Parameter Error',
                errors: {
                    username: 'Username is required',
                    password: 'Password is required',
                },
            },
        });

        this.addResponse(HttpStatus.R401, StandardResponse.UNAUTHORIZED, 'Invalid username and password', {
            DEFAULT: {
                code: 401,
                message: 'Invalid username and password',
            },
        });

        this.addResponse(HttpStatus.R404, StandardResponse.NOT_FOUND, 'Username is not registered', {
            DEFAULT: {
                code: 404,
                message: 'Username is not registered',
            },
        });

        this.addResponse(HttpStatus.R423, StandardResponse.MAX_TRIES, 'Max tries was reached', {
            DEFAULT: {
                code: 423,
                message: 'Max attempt was reach please try again later',
            },
        });
    }
}
