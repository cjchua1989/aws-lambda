import axios, { AxiosInstance } from 'axios';
import { Logger } from '../../../../libs/Logger';
import { WalletServiceResponse } from '../core/responses';
import {
    CAAS_ADMIN_KEY,
    CAAS_ADMIN_SECRET,
    CAAS_CLIENT_KEY,
    CAAS_CLIENT_SECRET,
    CAAS_WALLET_URL,
} from '../WalletFactory';

export class CaasWalletService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: CAAS_WALLET_URL,
            timeout: 30000,
        });
    }

    async authClient(): Promise<WalletServiceResponse> {
        try {
            const payload = {
                key: CAAS_CLIENT_KEY,
                secret: CAAS_CLIENT_SECRET,
            };
            const result = await this.client.post('/auth', payload);

            const { code, valid_until, message, access_token } = result.data;
            Logger.info('Authentication successful', {
                status: result.status,
                response: result.data,
            });

            return {
                code,
                message,
                access_token,
                valid_until,
            };
        } catch (error) {
            Logger.debug('CaaSWalletService.authClient', error);
            throw new error();
        }
    }

    async authAdmin(): Promise<WalletServiceResponse> {
        try {
            const payload = {
                key: CAAS_ADMIN_KEY,
                secret: CAAS_ADMIN_SECRET,
            };
            const result = await this.client.post('/auth', payload);

            const { code, valid_until, message, access_token } = result.data;
            Logger.info('Authentication successful', {
                status: result.status,
                response: result.data,
            });

            return {
                code,
                message,
                access_token,
                valid_until,
            };
        } catch (error) {
            Logger.debug('CaaSWalletService.authAdmin', error);
            throw new error();
        }
    }
}
