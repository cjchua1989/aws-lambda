import { Schema } from '../commands/Schema';
export class NotFoundResponse extends Schema {
    constructor() {
        super();

        this.name = 'not_found_response';
        this.baseResponse();
    }
}
