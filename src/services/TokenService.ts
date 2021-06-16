import { ApiGatewayEvent } from '../libs/Contracts/ApiGatewayEvent';
import { Logger } from '../libs/Logger';

export class TokenService {
    private event: ApiGatewayEvent;

    constructor(event: ApiGatewayEvent) {
        this.event = event;
        Logger.info('TokenService', event);
    }

    get user_id(): string {
        const user_id = this.event.requestContext?.authorizer.user_id;
        return user_id ?? '';
    }
}
