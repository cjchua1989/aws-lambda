import { Schema } from '../commands/Schema';
export class ParameterErrorResponse extends Schema {
    constructor() {
        super();

        this.name = 'parameter_error_response';
        this.baseResponse();
    }
}
