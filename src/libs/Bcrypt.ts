import { createHmac } from 'crypto';

export class Bcrypt {
    static generate(text: string): string {
        return createHmac('sha1', text).update(text.trim().toLowerCase()).digest('hex');
    }
}
