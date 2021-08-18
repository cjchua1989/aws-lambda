import { OTPResponse, OTPNotFound } from './core/responses';
import { OTPRequest, VerifyOTP } from './core/requests';
import { SMSOTPAdaptor } from './adaptor/SMSOTPAdaptor';
import { EmailOTPAdaptor } from './adaptor/EmailOTPAdaptor';

export const CAAS_OTP_URL = process.env.CAAS_OTP_URL ?? '';

export enum OTPType {
    SMS = 'sms',
    EMAIL = 'email',
}

export interface OTPAdaptor {
    generateToken(): Promise<void>;
    sendOTP(request: OTPRequest): Promise<OTPResponse>;
    verifyOTP(request: VerifyOTP): Promise<OTPResponse>;
}

export class OTPFactory {
    static getService(request: OTPRequest): OTPAdaptor {
        switch (request.otp_type) {
            case OTPType.SMS:
                return new SMSOTPAdaptor();
            case OTPType.EMAIL:
                return new EmailOTPAdaptor();
            default:
                throw new OTPNotFound();
        }
    }
}
