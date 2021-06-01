import { Handler } from './Handler';

export class ApiHandler implements Handler {
    config = `
<name>:
  handler: src/functions/apis/<name>/handler.execute
  events:
    - http:
        path: /<path>
        method: <method>
        cors: true

  environment:    
    `;
    handler = `
import { Databases } from '../../../libs/Mysql';
import { API_RESPONSE, THROW_API_ERROR } from '../../../libs/Response';
import { APIHttpResponse } from '../../../libs/Contracts/APIHttpResponse';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';

import Validate from './validate';
import { Responses } from './responses';
import { <request_name> } from './requests';
import { <action_name> } from './action';

export async function execute(event: ApiGatewayEvent): Promise<APIHttpResponse> {
    try {
        const request: <request_name> = Validate(JSON.parse(event.body));
        const connection = await Databases.getConnection();
        const action = new <action_name>(connection);
        await action.execute();

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
import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

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
    handler_test = `
import { execute } from './handler';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';
import { <request_name> } from './requests';
import * as faker from 'faker';

test('422: PARAMETER ERROR', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<<request_name>>{
            parameter_name: '',
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('errors');
    // expect(response).toHaveProperty('errors.field_name'); // Add the required fields

    expect(result.statusCode).toBe(422);
    expect(response.code).toBe(422);
});

test('200: SUCCESS', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<<request_name>>{
            parameter_name: 'value',
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    // expect(response).toHaveProperty('field_name'); // Add the required fields

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});
    `;
    action = `
import { Connection } from 'typeorm';

export class <action_name> {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }
    
    async execute(): Promise<void> {}
}
    `;
}
