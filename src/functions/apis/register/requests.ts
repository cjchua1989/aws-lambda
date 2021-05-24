import { HttpRequest } from '../../../libs/Contracts/HttpRequest';

export class RegisterRequest implements HttpRequest {
    name: string;
    email: string;
    mobile: string;
    password: string;
}
