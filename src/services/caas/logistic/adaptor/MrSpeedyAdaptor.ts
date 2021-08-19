import { MrSpeedyService } from '../service/MrSpeedyService';
import { LogisticAdaptor } from '../LogisticFactory';
import { LogisticResponse } from '../core/responses';
import { LogisticBookRequest, LogisticRequest } from '../core/requests';

export class MrSpeedyAdaptor implements LogisticAdaptor {
    private service: MrSpeedyService;

    constructor() {
        this.service = new MrSpeedyService();
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
