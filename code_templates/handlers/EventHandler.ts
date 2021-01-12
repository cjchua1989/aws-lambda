import { Handler } from './Handler';

export class EventHandler implements Handler {
    config = `
<name>:
  handler: src/functions/events/<name>/handler.execute
  timeout: 60
  environment:    
    `;
    handler = `
import { Databases } from '../../../libs/Mysql';
import {
    RESPONSE,
    THROW_ERROR,
} from '../../../libs/Response';
import { HttpResponse } from "../../../libs/Contracts/HttpResponse";

import Validate from './validate';
import { Responses } from './responses';
import { <request_name> } from './requests';

export async function execute(
    event: <request_name>
): Promise<HttpResponse> {
    try {
        const request: <request_name> = Validate(event);
        const connection = await Databases.getConnection();
        
        return RESPONSE(Responses.STATUS_200);
    } catch (error) {
        return THROW_ERROR(error);
    } finally {
        await Databases.closeConnection();
    }
}    
    `;
    responses = `
import { HttpResponse } from "../../../libs/Contracts/HttpResponse";

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
import { HttpRequest } from '../../../libs/Contracts/HttpRequest';

export class <request_name> implements HttpRequest {
}      
    `;
}
