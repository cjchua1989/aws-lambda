import { Schema } from '../commands/Schema';
export class BadRequestResponse extends Schema {
    constructor() {
        super();

        this.name = 'bad_request_response';
        this.baseResponse();
    }
}
