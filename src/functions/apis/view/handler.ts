import { Databases } from '../../../libs/Mysql';
import { API_RESPONSE, THROW_API_ERROR } from '../../../libs/Response';
import { APIHttpResponse } from '../../../libs/Contracts/APIHttpResponse';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';

import { Responses } from './responses';
import { ViewAction } from './action';

export async function execute(event: ApiGatewayEvent): Promise<APIHttpResponse> {
    try {
        const connection = await Databases.getConnection();
        const action = new ViewAction(connection);
        const data = await action.execute(event.pathParameters!.id);

        return API_RESPONSE({
            ...Responses.STATUS_200,
            data,
        });
    } catch (error) {
        return THROW_API_ERROR(error);
    } finally {
        await Databases.closeConnection();
    }
}
