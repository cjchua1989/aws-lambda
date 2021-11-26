import {
    Context,
    Effect,
    Event,
    generatePolicy,
    MiddlewareService,
    Policy,
    TokenData,
} from '../../../services/MiddlewareService';
import { Logger } from '../../../libs/Logger';
import { JWT } from '../../../libs/JWT';
import { TokenType } from '../../../helper/Enums';
import { Databases } from '../../../libs/Mysql';
import { WarmerService } from '../../../services/WarmerService';

export async function execute(event: Event, context?: Context): Promise<string | Policy> {
    const request_id = context !== undefined && context.awsRequestId ? context.awsRequestId : '';
    const resource = event.methodArn;

    try {
        WarmerService.execute(event);

        if (typeof event.authorizationToken === 'undefined' || event.authorizationToken === '') {
            Logger.error('Authorization:403', { event, context });
            return generatePolicy(request_id, Effect.DENY, resource);
        }

        // Validate jwt if access token
        const tokenData = await JWT.verifyToken<TokenData>(event.authorizationToken);
        if (tokenData.type !== TokenType.REFRESH_TOKEN) {
            Logger.error('Authorization:403', { event, context });
            return generatePolicy(request_id, Effect.DENY, resource);
        }

        // Validate user if existing from validated jwt
        const connection = await Databases.getConnection();
        const middlewareService = new MiddlewareService(connection);
        await middlewareService.checkUserUsingJWT(tokenData.user_id);

        Logger.info('Authorization:200', { event, context });
        return generatePolicy(request_id, Effect.ALLOW, resource, tokenData.user_id);
    } catch (error) {
        Logger.error('Authorization:403', { event, context });
        return generatePolicy(request_id, Effect.DENY, resource);
    } finally {
        /* Close connection after validating the user */
        await Databases.closeConnection();
    }
}
