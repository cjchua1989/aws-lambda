import { Schema } from '../commands/Schema';
export class DeletedResponse extends Schema {
    constructor() {
        super();

        this.name = 'deleted_response';
        this.baseResponse();
    }
}
