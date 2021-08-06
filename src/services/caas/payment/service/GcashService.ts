import { CaasPaymentService } from '../core/CaasPaymentService';
import { PaymentResponse } from '../core/responses';
import { RefundRequest } from '../core/requests';
import { Logger } from '../../../../libs/Logger';

export class GcashService extends CaasPaymentService {
    async refund(request: RefundRequest): Promise<PaymentResponse> {
        try {
            await this.generateToken();

            const result = await this.client.post('/refund', request, this.config);

            return {
                code: result.data.code,
                message: result.data.message,
            };
        } catch (error) {
            Logger.debug(`GcashService.refund - ${request.transaction_id}`, error);
            return {
                code: error.response.data.code,
                message: error.response.data.message,
                data: error.response.data.errors,
            };
        }
    }
}
