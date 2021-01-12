import { Handler } from './Handler';

export class ApiHandler implements Handler {
    config = `
<name>:
  handler: src/functions/apis/<name>/handler.execute
  events:
    - http:
        path: /<path>
        method: <method>
        timeout: 300
        cors: true

  environment:    
    `;
    handler = `
import { Databases } from '../../../libs/Mysql';
import {
    API_RESPONSE,
    THROW_API_ERROR,
} from '../../../libs/Response';
import {APIHttpResponse} from '../../../libs/Contracts/APIHttpResponse';
import {ApiGatewayEvent} from '../../../libs/Contracts/ApiGatewayEvent';

import Validate from './validate';
import { Responses } from './responses';
import { <request_name> } from './requests';

export async function execute(
    event: ApiGatewayEvent
): Promise<APIHttpResponse> {
    try {
        const request: <request_name> = Validate(JSON.parse(event.body));
        const connection = await Databases.getConnection();
        
        return API_RESPONSE({
            ...Responses.STATUS_200,
        });
    } catch (error) {
        return THROW_API_ERROR(error);
    } finally {
        await Databases.closeConnection();
    }
}  
    `;
    responses = `
import {HttpResponse} from '../../../libs/Contracts/HttpResponse';

export class Responses {
    static STATUS_200: HttpResponse = {
        code: 200,
        message: '<success_message>',
    };
}
    `;
    validate = `
import { Validation } from '../../../libs/Validation';
import { joi } from '../../../libs/Joi';
import { <request_name> } from './requests';

export default (request: <request_name>): <request_name> => {
    const schema = joi
        .object({
            parameter_name: joi.string().required(),
        })
        .required();

    const validate = new Validation<<request_name>>(schema);
    return validate.validate(request);
};
    `;
    requests = `
import {HttpRequest} from '../../../libs/Contracts/HttpRequest';

export class <request_name> implements HttpRequest {
}   
    `;
}
