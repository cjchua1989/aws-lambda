import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

export class Responses {
    static STATUS_200: HttpResponse = {
        code: 200,
        message: 'User successfully added',
    };
}

export class EmailExist {
    code = 409;
    message = 'Email already exist';
}

export class MobileExist {
    code = 409;
    message = 'Mobile  already exist';
}
