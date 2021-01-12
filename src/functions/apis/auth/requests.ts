import { HttpRequest } from '../../../libs/Contracts/HttpRequest';

export class AuthRequest implements HttpRequest {
    username: string;
    password: string;
}
