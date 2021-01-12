export class ApiTokenExpiredError {
    public code: number;
    public message: string;

    public constructor() {
        this.code = 419;
        this.message = 'Access token is expired';
    }
}
