export interface WalletResponse {
    code: number;
    message: string;
}

export interface WalletServiceResponse extends WalletResponse {
    access_token: string;
    valid_until: string;
}

export class WalletNotFound {
    code = 404;
    message = 'Wallet Not Found';
}
