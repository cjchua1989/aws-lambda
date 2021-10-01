export interface PaymentResponse {
    code: number;
    message: string;
    url?: string;
    transaction_id?: string;
    data?: Array<unknown>;
}

export class PaymentNotFound {
    code = 404;
    message = 'Payment Not Found';
}
