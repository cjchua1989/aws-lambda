import { Schema } from '../commands/Schema';
export class TokenExpiredResponse extends Schema {
    constructor() {
        super();

        this.name = 'token_expired_response';
        this.baseResponse();
    }
}
