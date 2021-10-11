import { Schema } from '../commands/Schema';
export class OtpExpiredResponse extends Schema {
    constructor() {
        super();

        this.name = 'otp_expired_response';
        this.baseResponse();
    }
}
