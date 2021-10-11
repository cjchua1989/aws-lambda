import { Schema } from '../commands/Schema';
export class UpdatedResponse extends Schema {
    constructor() {
        super();

        this.name = 'updated_response';
        this.baseResponse();
    }
}
