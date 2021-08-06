import { WalletNotFound, WalletServiceResponse } from './core/responses';
import { CaasAdaptor } from './adaptor/CaasAdaptor';

export const CAAS_WALLET_URL = process.env.CAAS_WALLET_URL ?? '';
export const CAAS_CLIENT_KEY = process.env.CAAS_CLIENT_KEY ?? '';
export const CAAS_CLIENT_SECRET = process.env.CAAS_CLIENT_SECRET ?? '';
export const CAAS_ADMIN_KEY = process.env.CAAS_ADMIN_KEY ?? '';
export const CAAS_ADMIN_SECRET = process.env.CAAS_ADMIN_SECRET ?? '';

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
