import { Schema } from './Schema';

export class Response extends Schema {
    constructor() {
        super();

        this.addNumber('code', 'Code of the response');
        this.addString('message', 'Message about the response');
    }
}
