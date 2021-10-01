export interface PaymentRequest {
    id: string;
    amount: number;
    product_name: string;
    customer: {
        name: string;
        email: string;
        mobile: string;
    };
    callback: string;
    success: string;
    failed: string;
    payment: string;
    meta_info: {
        project: string;
    };
}

export interface RefundRequest {
    transaction_id: string;
    callback: string;
}
