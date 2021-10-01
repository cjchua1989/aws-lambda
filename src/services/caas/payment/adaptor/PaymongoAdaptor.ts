import { PaymentAdaptor } from '../PaymentFactory';
import { PaymentRequest, RefundRequest } from '../core/requests';
import { PaymentResponse } from '../core/responses';
import { PaymongoService } from '../service/PaymongoService';

export class PaymongoAdaptor implements PaymentAdaptor {
    private service: PaymongoService;

    constructor() {
        this.service = new PaymongoService();
    }

    async generateToken(): Promise<void> {
        return this.service.generateToken();
    }

    async pay(request: PaymentRequest): Promise<PaymentResponse> {
        return this.service.pay(request);
    }

    async refund(request: RefundRequest): Promise<PaymentResponse> {
        return this.service.refund(request);
    }
}
