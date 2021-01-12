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
import {
    RESPONSE,
    THROW_ERROR,
} from '../../../libs/Response';
import { HttpResponse } from "../../../libs/Contracts/HttpResponse";

import { Responses } from './responses';

export async function execute(): Promise<HttpResponse> {
    try{
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
    validate = ``;
    requests = ``;
}
