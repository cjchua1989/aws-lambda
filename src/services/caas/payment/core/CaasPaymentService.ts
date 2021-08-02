import axios, { AxiosInstance } from 'axios';
import { CAAS_PAYMENT_URL } from '../PaymentFactory';
import { PaymentRequest } from './requests';
import { PaymentResponse } from './responses';
import { WalletFactory, WalletType } from '../../wallet/WalletFactory';
import { Logger } from '../../../../libs/Logger';

export class CaasPaymentService {
    protected client: AxiosInstance;
    protected config = {};

    constructor() {
        this.client = axios.create({
            baseURL: CAAS_PAYMENT_URL,
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

    async pay(request: PaymentRequest): Promise<PaymentResponse> {
        try {
            await this.generateToken();

            const result = await this.client.post('/start', request, this.config);

            return {
                code: result.data.code,
                message: result.data.message,
                url: result.data.url,
                transaction_id: result.data.transaction_id,
            };
        } catch (error) {
            Logger.debug(`CaasPaymentService.pay - ${request.payment}`, error);
            return {
                code: error.response.data.code,
                message: error.response.data.message,
                data: error.response.data.errors,
            };
        }
    }
}
