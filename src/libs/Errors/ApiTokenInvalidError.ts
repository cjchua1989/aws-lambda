export class ApiTokenInvalidError {
    public code: number;
    public message: string;

    public constructor() {
        this.code = 401;
        this.message = 'Unauthorized';
    }
}
