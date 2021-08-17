import { LogisticNotFound, LogisticResponse } from './core/responses';
import { GrabAdaptor } from './adaptor/GrabAdaptor';
import { MrSpeedyAdaptor } from './adaptor/MrSpeedyAdaptor';
import { NinjaVanAdaptor } from './adaptor/NinjaVanAdaptor';
import { LogisticBookRequest, LogisticRequest } from './core/requests';

export const CAAS_LOGISTIC_URL = process.env.CAAS_LOGISTIC_URL ?? '';

export enum LogisticType {
    GRAB = 'grab',
    MR_SPEEDY = 'mr_speedy',
    NINJA_VAN = 'ninja_van',
}

export enum LogisticPaymentType {
    CASH = 'CASH',
    CASHLESS = 'CASHLESS',
}

export interface LogisticAdaptor {
    quotation(request: LogisticRequest): Promise<LogisticResponse>;
    bookDelivery(request: LogisticBookRequest): Promise<LogisticResponse>;
    getDelivery(transaction_id: string): Promise<LogisticResponse>;
    cancelDelivery(transaction_id: string): Promise<LogisticResponse>;
}

export class LogisticFactory {
    static getService(logistic: LogisticType): LogisticAdaptor {
        switch (logistic) {
            case LogisticType.GRAB:
                return new GrabAdaptor();
            case LogisticType.MR_SPEEDY:
                return new MrSpeedyAdaptor();
            case LogisticType.NINJA_VAN:
                return new NinjaVanAdaptor();
            default:
                throw new LogisticNotFound();
        }
    }
}
