import { Schema } from '../commands/Schema';
export class SuccessResponse extends Schema {
    constructor() {
        super();

        this.name = 'success_response';
        this.baseResponse();
    }
}
