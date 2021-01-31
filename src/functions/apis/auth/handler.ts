import { Databases } from '../../../libs/Mysql';
import { API_RESPONSE, THROW_API_ERROR } from '../../../libs/Response';
import { APIHttpResponse } from '../../../libs/Contracts/APIHttpResponse';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';

import Validate from './validate';
import { Responses } from './responses';
import { AuthRequest } from './requests';
import { AuthAction } from './action';

export async function execute(event: ApiGatewayEvent): Promise<APIHttpResponse> {
    try {
        const request: AuthRequest = Validate(JSON.parse(event.body));
        const connection = await Databases.getConnection();
        const action = new AuthAction(connection);
        const user = await action.execute(request.username, request.password);

        return API_RESPONSE({
            ...Responses.STATUS_200,
            user: {
                name: user.name,
                email: user.email,
                mobile: user.mobile,
            },
        });
    } catch (error) {
        return THROW_API_ERROR(error);
    } finally {
        await Databases.closeConnection();
    }
}
