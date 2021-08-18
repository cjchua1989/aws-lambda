import { CaasOTPService } from '../core/CaasOTPService';
import { OTPResponse } from '../core/responses';
import { SMSOTPRequest, VerifySMSOTPRequest } from '../core/requests';
import { Logger } from '../../../../libs/Logger';

export class SMSService extends CaasOTPService {
    async requestSMSOTP(request: SMSOTPRequest): Promise<OTPResponse> {
        try {
            await this.generateToken();

            const result = await this.client.post('/sms', request, this.config);

            return {
                code: result.data.code,
                message: result.data.message,
            };
        } catch (error) {
            Logger.debug(`CaasOTPService - ${request.mobile}`, error);
            return {
                code: error.response.data.code,
                message: error.response.data.message,
                data: error.response.data.errors,
            };
        }
    }

    async verifySMSOTP(request: VerifySMSOTPRequest): Promise<OTPResponse> {
        try {
            await this.generateToken();

            const result = await this.client.post('/mobile/verify', request, this.config);

            return {
                code: result.data.code,
                message: result.data.message,
            };
        } catch (error) {
            Logger.debug(`CaasOTPService - ${request.mobile}`, error);
            return {
                code: error.response.data.code,
                message: error.response.data.message,
                data: error.response.data.errors,
            };
        }
    }
}
