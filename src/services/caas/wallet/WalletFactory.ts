import { WalletNotFound, WalletServiceResponse } from './core/responses';
import { CaasAdaptor } from './adaptor/CaasAdaptor';

export const CAAS_WALLET_URL = process.env.CAAS_WALLET_URL ?? 'https://api-dev.917v.com.ph/wallets';
export const CAAS_CLIENT_KEY = process.env.CAAS_CLIENT_KEY ?? 'HxJixNUjadfOQW7MGR';
export const CAAS_CLIENT_SECRET = process.env.CAAS_CLIENT_SECRET ?? '27vxc3NNlq13raxpx2UslkPYv6xWwzyqtsoiAWHCsRJ5S4kpYack9qlnfVngLV6DEaKFy94L2WG6LkqQxJAwfRDl';
export const CAAS_ADMIN_KEY = process.env.CAAS_ADMIN_KEY ?? 'KZfHfNWjtQRpqC0Hd2';
export const CAAS_ADMIN_SECRET = process.env.CAAS_ADMIN_SECRET ?? 'x5ljPT60IdpW7kgX7MdFNMTvdQioVtIHAfsZRmOcZObM1MpqRow3pjpVP7BXH4HydiItXoIGKHaGHLPWkVYuKVwf';

export enum WalletType {
    CAAS = 'caas',
}

export interface WalletAdaptor {
    authClient(): Promise<WalletServiceResponse>;
}

export class WalletFactory {
    static getService(wallet: WalletType): WalletAdaptor {
        switch (wallet) {
            case WalletType.CAAS:
                return new CaasAdaptor();
            default:
                throw new WalletNotFound();
        }
    }
}
