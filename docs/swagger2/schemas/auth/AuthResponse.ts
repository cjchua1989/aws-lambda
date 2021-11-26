import { ResponseSchema } from '../../commands/Schema';
import { AUTH_RESPONSE } from '../../helpers/Auth/structure';

export class AuthResponse extends ResponseSchema {
    constructor() {
        super();
        this.addAttribute('data', AUTH_RESPONSE);
    }
}
