import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

export class Responses {
    static STATUS_200: HttpResponse = {
        code: 200,
        message: 'Login successful',
    };
}

export class AuthAccessDenied {
    public code = 401;
    public message = 'Invalid username and password';
}
