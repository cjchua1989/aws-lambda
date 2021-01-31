import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

export class Responses {
    static STATUS_200: HttpResponse = {
        code: 200,
        message: 'Login successful',
    };

    static STATUS_401: HttpResponse = {
        code: 401,
        message: 'Invalid username and password',
    };
}

export class AuthAccessDenied {
    public code: number;
    public message: string;

    public constructor() {
        this.code = 401;
        this.message = 'Invalid username and password';
    }
}
