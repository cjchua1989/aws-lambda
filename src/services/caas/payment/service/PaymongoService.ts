import { CaasPaymentService } from '../core/CaasPaymentService';
import { PaymentResponse } from '../core/responses';
import { RefundRequest } from '../core/requests';

export class PaymongoService extends CaasPaymentService {
    async refund(request: RefundRequest): Promise<PaymentResponse> {
        return {
            code: 403,
            message: `Refund for ${request.transaction_id} not supported`,
        };
    }
}
