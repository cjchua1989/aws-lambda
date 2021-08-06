import { PaymentAdaptor } from '../PaymentFactory';
import { PaymentRequest, RefundRequest } from '../core/requests';
import { PaymentResponse } from '../core/responses';
import { GcashService } from '../service/GcashService';

export class GcashAdaptor implements PaymentAdaptor {
    private service: GcashService;

    constructor() {
        this.service = new GcashService();
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
