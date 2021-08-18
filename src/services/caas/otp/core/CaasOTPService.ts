import axios, { AxiosInstance } from 'axios';
import { CAAS_OTP_URL } from '../OTPFactory';
import { WalletFactory, WalletType } from '../../wallet/WalletFactory';

export class CaasOTPService {
    protected client: AxiosInstance;
    protected config = {};

    constructor() {
        this.client = axios.create({
            baseURL: CAAS_OTP_URL,
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
}
