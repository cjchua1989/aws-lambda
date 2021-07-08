import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

export class Responses {
    static STATUS_200: HttpResponse = {
        code: 200,
        message: 'User list',
    };
}
