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
import { RESPONSE, THROW_ERROR } from '../../../libs/Response';
import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

import Validate from './validate';
import { Responses } from './responses';
import { <request_name> } from './requests';
import { <action_name> } from './action';

export async function execute(event: <request_name>): Promise<HttpResponse> {
    try {
        const request: <request_name> = Validate(event);
        const connection = await Databases.getConnection();
        const action = new <action_name>(connection);
        await action.execute();

        return RESPONSE(Responses.STATUS_200);
    } catch (error) {
        return THROW_ERROR(error);
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
import { <request_name> } from './requests';
import * as faker from 'faker';

test('422: PARAMETER ERROR', async () => {
    const event: <request_name> = {
        parameter_name: '',
    };

    const response = await execute(event);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('errors');
    // expect(response).toHaveProperty('errors.field_name'); // Add the required fields

    expect(response.code).toBe(422);
});

test('200: SUCCESS', async () => {
    const event: <request_name> = {
        parameter_name: '',
    };

    const response = await execute(event);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    // expect(response).toHaveProperty('field_name'); // Add the required fields

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
