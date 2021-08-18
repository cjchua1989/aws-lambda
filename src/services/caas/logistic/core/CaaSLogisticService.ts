import axios, { AxiosInstance } from 'axios';
import { CAAS_LOGISTIC_URL } from '../LogisticFactory';
import { LogisticBookRequest, LogisticRequest } from './requests';
import { LogisticResponse } from './responses';
import { WalletFactory, WalletType } from '../../wallet/WalletFactory';
import { Logger } from '../../../../libs/Logger';

export class CaaSLogisticService {
    protected client: AxiosInstance;
    protected config = {};

    constructor() {
        this.client = axios.create({
            baseURL: CAAS_LOGISTIC_URL,
            timeout: 30000,
        });
    }

    async generateToken(): Promise<void> {
        const service = WalletFactory.getService(WalletType.CAAS);
        const response = await service.authClient();

        this.config = {
            headers: {
                Authorization: `Bearer ${response.access_token}`,
            },
        };
    }

    async quotation(request: LogisticRequest): Promise<LogisticResponse> {
        try {
            await this.generateToken();

            const result = await this.client.post('/delivery/quotation', request, this.config);

            Logger.info('CaaSLogisticService:quotation:success', result);
            return {
                code: result.data.code,
                message: result.data.message,
                data: result.data.data,
            };
        } catch (error) {
            Logger.debug('CaaSLogisticService:quotation:error', error);
            return {
                code: error.response.data.code,
                message: error.response.data.message,
                data: error.response.data.errors,
            };
        }
    }

    async bookDelivery(request: LogisticBookRequest): Promise<LogisticResponse> {
        try {
            await this.generateToken();

            const result = await this.client.post('/delivery', request, this.config);

            Logger.info('CaaSLogisticService:bookDelivery:success', result);
            return {
                code: result.data.code,
                message: result.data.message,
                data: result.data.data,
            };
        } catch (error) {
            Logger.debug('CaaSLogisticService:bookDelivery:error', error);
            return {
                code: error.response.data.code,
                message: error.response.data.message,
                data: error.response.data.errors,
            };
        }
    }

    async getDelivery(transaction_id: string): Promise<LogisticResponse> {
        try {
            await this.generateToken();

            const result = await this.client.get(`/delivery/${transaction_id}`, this.config);

            Logger.info('CaaSLogisticService:getDelivery:success', result);
            return {
                code: result.data.code,
                message: result.data.message,
                data: result.data.data,
            };
        } catch (error) {
            Logger.debug('CaaSLogisticService:getDelivery:error', error);
            return {
                code: error.response.data.code,
                message: error.response.data.message,
                data: error.response.data.errors,
            };
        }
    }

    async cancelDelivery(transaction_id: string): Promise<LogisticResponse> {
        try {
            await this.generateToken();

            const result = await this.client.delete(`/delivery/${transaction_id}`, this.config);

            Logger.info('CaaSLogisticService:cancelDelivery:success', result);
            return {
                code: result.data.code,
                message: result.data.message,
                data: result.data.data,
            };
        } catch (error) {
            Logger.debug('CaaSLogisticService:cancelDelivery:error', error);
            return {
                code: error.response.data.code,
                message: error.response.data.message,
                data: error.response.data.errors,
            };
        }
    }
}
