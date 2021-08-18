import { NinjaVanService } from '../service/NinjaVanService';
import { LogisticAdaptor } from '../LogisticFactory';
import { LogisticResponse } from '../core/responses';
import { LogisticBookRequest, LogisticRequest } from '../core/requests';

export class NinjaVanAdaptor implements LogisticAdaptor {
    private service: NinjaVanService;

    constructor() {
        this.service = new NinjaVanService();
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
