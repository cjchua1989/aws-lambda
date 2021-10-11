import { Schema } from '../../commands/Schema';
import { Types } from '../../commands/Types';

export class AuthRequest extends Schema {
    constructor() {
        super();
        this.name = 'auth_request';
        this.addAttribute('username', Types.STRING('Account email address or mobile number'));
        this.addAttribute('password', Types.STRING('Account password'));
    }
}
