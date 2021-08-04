import { WalletFactory, WalletType } from './WalletFactory';

test('200 SUCCESS', async () => {
    const service = WalletFactory.getService(WalletType.CAAS);
    const response = await service.authClient();

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('access_token');
    expect(response).toHaveProperty('valid_until');
});
