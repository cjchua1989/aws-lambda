import { OTPFactory } from '../OTPFactory';
import { OTPRequest, VerifyOTP } from '../core/requests';
import { OTPResponse } from '../core/responses';
import { SMSService } from '../service/SMSService';

export class SMSOTPAdaptor implements OTPFactory {
    private service: SMSService;

    constructor() {
        this.service = new SMSService();
    }

    async generateToken(): Promise<void> {
        return this.service.generateToken();
    }

    async sendOTP(request: OTPRequest): Promise<OTPResponse> {
        return this.service.requestSMSOTP({ mobile: request.contact_info });
    }

    async verifyOTP(request: VerifyOTP): Promise<OTPResponse> {
        return this.service.verifySMSOTP({ mobile: request.contact_info, otp: request.otp });
    }
}
