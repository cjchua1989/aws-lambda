export class ApiTokenError {
    public code: number;
    public message: string;

    public constructor() {
        this.code = 500;
        this.message = 'Something went wrong';
    }
}
