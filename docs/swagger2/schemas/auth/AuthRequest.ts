import { Schema } from '../../commands/Schema';
import { Types } from '../../commands/Types';

export class AuthRequest extends Schema {
    constructor() {
        super();
        this.addAttribute('key', Types.STRING('Account key provided'));
        this.addAttribute('secret', Types.STRING('Account secret provided'));
    }
}
