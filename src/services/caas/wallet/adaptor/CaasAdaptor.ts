import { WalletAdaptor } from '../WalletFactory';
import { CaasWalletService } from '../service/CaasWalletService';
import { WalletServiceResponse } from '../core/responses';

export class CaasAdaptor implements WalletAdaptor {
    private service: CaasWalletService;

    constructor() {
        this.service = new CaasWalletService();
    }

    async authClient(): Promise<WalletServiceResponse> {
        return this.service.authClient();
    }

    async authAdmin(): Promise<WalletServiceResponse> {
        return this.service.authAdmin();
    }
}
