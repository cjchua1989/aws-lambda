import { Schema } from '../../commands/Schema';
import { Types } from '../../commands/Types';

export class AuthResponse extends Schema {
    constructor() {
        super();

        this.name = 'auth_response';

        const user = {
            uuid: Types.STRING('Account ID'),
            email: Types.STRING('Account Email address'),
            mobile: Types.STRING('Account Mobile number'),
            name: Types.STRING('Account Name'),
        };
        const data = {
            user: Types.OBJECT(user, 'User Information'),
            access_token: Types.STRING('Access Token for the account'),
            refresh_token: Types.STRING('Refresh Token for the account'),
        };

        this.baseResponse();
        this.addAttribute('data', Types.OBJECT(data, 'Account data information'));
    }
}
