import { HttpRequest } from '../../../libs/Contracts/HttpRequest';

export class DeleteRequest implements HttpRequest {
    uuid: string;
}
