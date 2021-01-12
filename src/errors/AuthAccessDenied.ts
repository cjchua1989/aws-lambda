export class AuthAccessDenied {
    public code: number;
    public message: string;

    public constructor() {
        this.code = 401;
        this.message = 'Invalid username and password';
    }
}
