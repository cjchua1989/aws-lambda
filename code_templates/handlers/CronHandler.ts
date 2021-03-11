import { Handler } from './Handler';

export class CronHandler implements Handler {
    config = `
<name>:
  handler: src/functions/crons/<name>/handler.execute
  timeout: 300
  memorySize: 1024
  events:
    - schedule:
        rate: cron(0 0 * * ? *)
        enabled: true    
    `;
    handler = `
import { Databases } from '../../../libs/Mysql';
import { RESPONSE, THROW_ERROR } from '../../../libs/Response';
import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

import { Responses } from './responses';
import { <action_name> } from './action';

export async function execute(): Promise<HttpResponse> {
    try {
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
    validate = ``;
    requests = ``;
    handler_test = `
import { execute } from './handler';
import * as faker from 'faker';

test('200: SUCCESS', async () => {
    const response = await execute();

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
