import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

export class Responses {
    static STATUS_200: HttpResponse = {
        code: 200,
        message: 'Successfully user found',
    };
}

export class UserNotExist {
    code = 409;
    message = `User doesn't exist`;
}
