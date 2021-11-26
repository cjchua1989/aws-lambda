export interface AuthRequest {
    key: string;
    secret: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
}
