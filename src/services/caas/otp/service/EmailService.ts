import { CaasOTPService } from '../core/CaasOTPService';
import { OTPResponse } from '../core/responses';
import { EmailOTPRequest, VerifyEmailOTPRequest } from '../core/requests';
import { Logger } from '../../../../libs/Logger';

export class EmailService extends CaasOTPService {
    async requestEmailOTP(request: EmailOTPRequest): Promise<OTPResponse> {
        try {
            await this.generateToken();

            const result = await this.client.post('/email', request, this.config);

            return {
                code: result.data.code,
                message: result.data.message,
            };
        } catch (error) {
            Logger.debug(`CaasOTPService - ${request.email}`, error);
            return {
                code: error.response.data.code,
                message: error.response.data.message,
                data: error.response.data.errors,
            };
        }
    }

    async verifyEmailOTP(request: VerifyEmailOTPRequest): Promise<OTPResponse> {
        try {
            await this.generateToken();

            const result = await this.client.post('/email/verify', request, this.config);

            return {
                code: result.data.code,
                message: result.data.message,
            };
        } catch (error) {
            Logger.debug(`CaasOTPService - ${request.email}`, error);
            return {
                code: error.response.data.code,
                message: error.response.data.message,
                data: error.response.data.errors,
            };
        }
    }
}
