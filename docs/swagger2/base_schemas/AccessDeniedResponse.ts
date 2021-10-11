import { Schema } from '../commands/Schema';
export class AccessDeniedResponse extends Schema {
    constructor() {
        super();

        this.name = 'access_denied_response';
        this.baseResponse();
    }
}
