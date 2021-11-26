import { Databases } from '../../../libs/Mysql';
import { API_RESPONSE, THROW_API_ERROR } from '../../../libs/Response';
import { APIHttpResponse } from '../../../libs/Contracts/APIHttpResponse';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';
import { Responses } from './responses';
import { UserListAction } from './action';
import { HttpRequestHelper, PaginationQuery } from '../../../helper/HttpHelper';
import { WarmerService } from '../../../services/WarmerService';

interface QueryStringParameters extends PaginationQuery {
    sort_value: string;
}

export async function execute(event: ApiGatewayEvent): Promise<APIHttpResponse> {
    try {
        WarmerService.execute(event);
        const connection = await Databases.getConnection();
        const action = new UserListAction(connection);
        const data = await action.execute(
            HttpRequestHelper.extractPagination<QueryStringParameters>(
                <QueryStringParameters>event.queryStringParameters,
            ),
        );

        return API_RESPONSE({
            ...Responses.STATUS_200,
            ...data,
        });
    } catch (error) {
        return THROW_API_ERROR(error);
    } finally {
        await Databases.closeConnection();
    }
}
