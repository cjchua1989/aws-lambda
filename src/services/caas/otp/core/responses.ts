export interface OTPResponse {
    code: number;
    message: string;
    data?: Array<unknown>;
}

export class OTPNotFound {
    code = 404;
    message = 'OTP Not Found';
}