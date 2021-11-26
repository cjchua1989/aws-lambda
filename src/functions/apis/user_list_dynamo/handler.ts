import { API_RESPONSE, THROW_API_ERROR } from '../../../libs/Response';
import { APIHttpResponse } from '../../../libs/Contracts/APIHttpResponse';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';
import { Responses } from './responses';
import { UserListDynamoAction } from './action';
import { HttpRequestHelper, PaginationQuery } from '../../../helper/HttpHelper';
import { WarmerService } from '../../../services/WarmerService';

interface QueryStringParameters extends PaginationQuery {
    sort_value: string;
}

export async function execute(event: ApiGatewayEvent): Promise<APIHttpResponse> {
    try {
        WarmerService.execute(event);
        const action = new UserListDynamoAction();
        const data = await action.execute(
            HttpRequestHelper.extractDynamoPagination<QueryStringParameters>(
                <QueryStringParameters>event.queryStringParameters,
            ),
        );

        return API_RESPONSE({
            ...Responses.STATUS_200,
            ...data,
        });
    } catch (error) {
        return THROW_API_ERROR(error);
    }
}
