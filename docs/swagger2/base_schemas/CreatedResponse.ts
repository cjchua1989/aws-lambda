import { Schema } from '../commands/Schema';
export class CreatedResponse extends Schema {
    constructor() {
        super();

        this.name = 'created_response';
        this.baseResponse();
    }
}
