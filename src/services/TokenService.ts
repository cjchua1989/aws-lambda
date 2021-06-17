import { ApiGatewayEvent } from '../libs/Contracts/ApiGatewayEvent';
import { Logger } from '../libs/Logger';
import { JWT } from '../libs/JWT';
import { TokenData } from './MiddlewareService';
import { TokenType } from '../helper/Enums';

const REFRESH_TOKEN_EXPIRY = '30d';

export class TokenService {
    private event: ApiGatewayEvent;

    constructor(event: ApiGatewayEvent) {
        this.event = event;
        Logger.info('TokenService', event);
    }

    get user_id(): string {
        const user_id = this.event.requestContext?.authorizer.user_id;
        return user_id ?? '';
    }

    static async generateAccessToken(user_id: string): Promise<string> {
        const access_token = await JWT.generateToken<TokenData>({
            type: TokenType.ACCESS_TOKEN,
            user_id,
        });
        return access_token ?? '';
    }

    static async generateRefreshToken(user_id: string): Promise<string> {
        const refresh_token = await JWT.generateToken<TokenData>(
            {
                type: TokenType.REFRESH_TOKEN,
                user_id,
            },
            REFRESH_TOKEN_EXPIRY,
        );
        return refresh_token ?? '';
    }
}
