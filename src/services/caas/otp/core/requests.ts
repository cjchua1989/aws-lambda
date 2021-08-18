export interface OTPRequest {
    otp_type: string;
    contact_info: string;
}

export interface VerifyOTP {
    otp_type: string;
    contact_info: string;
    otp: string;
}

export interface SMSOTPRequest {
    mobile: string;
}

export interface EmailOTPRequest {
    email: string;
}

export interface VerifySMSOTPRequest {
    mobile: string;
    otp: string;
}

export interface VerifyEmailOTPRequest {
    email: string;
    otp: string;
}