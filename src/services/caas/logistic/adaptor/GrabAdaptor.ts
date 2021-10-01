import { GrabService } from '../service/GrabService';
import { LogisticAdaptor } from '../LogisticFactory';
import { LogisticBookRequest, LogisticRequest } from '../core/requests';
import { LogisticResponse } from '../core/responses';

export class GrabAdaptor implements LogisticAdaptor {
    private service: GrabService;

    constructor() {
        this.service = new GrabService();
    }

    async quotation(request: LogisticRequest): Promise<LogisticResponse> {
        return this.service.quotation(request);
    }

    async bookDelivery(request: LogisticBookRequest): Promise<LogisticResponse> {
        return this.service.bookDelivery(request);
    }

    async getDelivery(transaction_id: string): Promise<LogisticResponse> {
        return this.service.getDelivery(transaction_id);
    }

    async cancelDelivery(transaction_id: string): Promise<LogisticResponse> {
        return this.service.cancelDelivery(transaction_id);
    }
}
