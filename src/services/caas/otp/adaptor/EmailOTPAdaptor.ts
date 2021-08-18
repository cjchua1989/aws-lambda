import { OTPFactory } from '../OTPFactory';
import { OTPRequest, VerifyOTP } from '../core/requests';
import { OTPResponse } from '../core/responses';
import { EmailService } from '../service/EmailService';

export class EmailOTPAdaptor implements OTPFactory {
    private service: EmailService;

    constructor() {
        this.service = new EmailService();
    }

    async generateToken(): Promise<void> {
        return this.service.generateToken();
    }

    async sendOTP(request: OTPRequest): Promise<OTPResponse> {
        return this.service.requestEmailOTP({ email: request.contact_info });
    }

    async verifyOTP(request: VerifyOTP): Promise<OTPResponse> {
        return this.service.verifyEmailOTP({ email: request.contact_info, otp: request.otp });
    }
}
