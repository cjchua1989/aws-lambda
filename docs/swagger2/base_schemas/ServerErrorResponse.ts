import { Schema } from '../commands/Schema';
export class ServerErrorResponse extends Schema {
    constructor() {
        super();

        this.name = 'server_error_response';
        this.baseResponse();
    }
}
