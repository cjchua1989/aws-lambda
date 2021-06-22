import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

export class Responses {
    static STATUS_200: HttpResponse = {
        code: 200,
        message: 'User information',
    };
}

export class UserNotFound {
    code = 404;
    message = 'User not found';
}
