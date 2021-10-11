import { Schema } from '../commands/Schema';
export class DuplicateResponse extends Schema {
    constructor() {
        super();

        this.name = 'duplicate_response';
        this.baseResponse();
    }
}
