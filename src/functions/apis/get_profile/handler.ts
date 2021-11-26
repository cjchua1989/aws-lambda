import { Databases } from '../../../libs/Mysql';
import { API_RESPONSE, THROW_API_ERROR } from '../../../libs/Response';
import { APIHttpResponse } from '../../../libs/Contracts/APIHttpResponse';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';
import { Responses } from './responses';
import { GetProfileAction } from './action';
import { TokenService } from '../../../services/TokenService';
import { WarmerService } from '../../../services/WarmerService';

export async function execute(event: ApiGatewayEvent): Promise<APIHttpResponse> {
    try {
        WarmerService.execute(event);
        const user_id = new TokenService(event).user_id;
        const connection = await Databases.getConnection();
        const action = new GetProfileAction(connection);
        const user = await action.execute(user_id);

        return API_RESPONSE({
            ...Responses.STATUS_200,
            data: {
                user,
            },
        });
    } catch (error) {
        return THROW_API_ERROR(error);
    } finally {
        await Databases.closeConnection();
    }
}
