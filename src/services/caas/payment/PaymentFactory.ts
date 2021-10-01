import { PaymentNotFound, PaymentResponse } from './core/responses';
import { PaymentRequest, RefundRequest } from './core/requests';
import { GcashAdaptor } from './adaptor/GcashAdaptor';
import { PaymongoAdaptor } from './adaptor/PaymongoAdaptor';

export const CAAS_PAYMENT_URL = process.env.CAAS_PAYMENT_URL ?? '';

export enum PaymentType {
    GCASH = 'gcash',
    CREDIT_CARD = 'credit_card',
    COD = 'cod',
}

export interface PaymentAdaptor {
    generateToken(): Promise<void>;
    pay(request: PaymentRequest): Promise<PaymentResponse>;
    refund(request: RefundRequest): Promise<PaymentResponse>;
}

export class PaymentFactory {
    static getService(payment: PaymentType): PaymentAdaptor {
        switch (payment) {
            case PaymentType.GCASH:
                return new GcashAdaptor();
            case PaymentType.CREDIT_CARD:
                return new PaymongoAdaptor();
            default:
                throw new PaymentNotFound();
        }
    }
}
