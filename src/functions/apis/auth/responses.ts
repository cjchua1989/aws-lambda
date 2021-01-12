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
