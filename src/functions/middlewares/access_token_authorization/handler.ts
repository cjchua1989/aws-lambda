import { Logger } from '../../../libs/Logger';
import { Context, Effect, Event, generatePolicy, Policy, TokenData } from '../../../services/MiddlewareService';
import { JWT } from '../../../libs/JWT';
import { TokenType } from '../../../Helper/Enums';
import { Databases } from '../../../libs/Mysql';

export async function execute(event: Event, context?: Context): Promise<Policy> {
    const request_id = context !== undefined && context.awsRequestId ? context.awsRequestId : '';
    const resource = event.methodArn;

    try {
        if (typeof event.authorizationToken === 'undefined' || event.authorizationToken === '') {
            Logger.error('Authorization:403', { event, context });
            return generatePolicy(request_id, Effect.DENY, resource);
        }

        const tokenData = await JWT.verifyToken<TokenData>(event.authorizationToken);
        if (tokenData.type !== TokenType.ACCESS_TOKEN) {
            Logger.error('Authorization:403', { event, context });
            return generatePolicy(request_id, Effect.DENY, resource);
        }

        /* TODO: Add your code that will validate the user from the verified token */

        Logger.info('Authorization:200', { event, context });
        return generatePolicy(request_id, Effect.ALLOW, resource);
    } catch (error) {
        Logger.error('Authorization:403', { event, context });
        return generatePolicy(request_id, Effect.DENY, resource);
    } finally {
        /* Close connection after validating the user */
        await Databases.closeConnection();
    }
}
