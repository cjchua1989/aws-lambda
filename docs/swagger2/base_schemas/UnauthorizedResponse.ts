import { Schema } from '../commands/Schema';
export class UnauthorizedResponse extends Schema {
    constructor() {
        super();

        this.name = 'unauthorized_response';
        this.baseResponse();
    }
}
