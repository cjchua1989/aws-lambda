import { ApiGatewayEvent, Event } from '../libs/Contracts/ApiGatewayEvent';
import { Logger } from '../libs/Logger';

class WarmerInvocation {
    code = 200;
    message = 'Warmer invocation';
}

export class WarmerService {
    static execute(event: Event | ApiGatewayEvent): void {
        const source = event.source ?? '';
        if (source === 'serverless-plugin-warmup') {
            Logger.info('WarmerService', event);
            throw new WarmerInvocation();
        }
    }
}
