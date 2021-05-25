import { createHmac } from 'crypto';
const bcrypt = require('bcrypt');

export class Bcrypt {
    static generate(text: string): string {
        return createHmac('sha1', text).update(text.trim().toLowerCase()).digest('hex');
    }

    static generateHashPassword(text: string): string {
        const salt = bcrypt.genSaltSync(5);
        return bcrypt.hashSync(text, salt);
    }
}
