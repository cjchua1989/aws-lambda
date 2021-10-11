import { Schema } from '../commands/Schema';
export class MaxTriesResponse extends Schema {
    constructor() {
        super();

        this.name = 'max_tries_response';
        this.baseResponse();
    }
}
