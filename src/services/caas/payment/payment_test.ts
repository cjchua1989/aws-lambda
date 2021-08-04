import { PaymentFactory, PaymentType } from './PaymentFactory';
import * as faker from 'faker';

test('200 SUCCESS GCASH PAYMENT', async () => {
    const request = {
        id: faker.datatype.uuid(),
        amount: 1,
        product_name: faker.random.words(2),
        customer: {
            name: 'Jerwyn Rabor 123',
            email: 'jrabor123@yondu.com',
            mobile: '09277913292',
        },
        callback: 'https://df8744f8134b.ngrok.io/callback?transaction=13',
        success: 'https://df8744f8134b.ngrok.io/success',
        failed: 'https://df8744f8134b.ngrok.io/failed',
        payment: PaymentType.GCASH,
        meta_info: {
            project: 'BentaTV (Seed)',
        },
    };

    const service = PaymentFactory.getService(request.payment);
    const response = await service.pay(request);
    console.debug(response);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('transaction_id');
    expect(response).toHaveProperty('url');
});

test('200 SUCCESS CREDIT PAYMENT', async () => {
    const request = {
        id: faker.datatype.uuid(),
        amount: 100,
        product_name: faker.random.words(2),
        customer: {
            name: 'Jerwyn Rabor 123',
            email: 'jrabor123@yondu.com',
            mobile: '09277913292',
        },
        callback: 'https://df8744f8134b.ngrok.io/callback?transaction=13',
        success: 'https://df8744f8134b.ngrok.io/success',
        failed: 'https://df8744f8134b.ngrok.io/failed',
        payment: PaymentType.CREDIT_CARD,
        meta_info: {
            project: 'BentaTV (Seed)',
        },
    };

    const service = PaymentFactory.getService(request.payment);
    const response = await service.pay(request);
    console.debug(response);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('transaction_id');
    expect(response).toHaveProperty('url');
});

test('200 SUCCESS GCASH REFUND', async () => {
    const request = {
        transaction_id: '90f70742-c54d-4117-a6e6-a7ad024dbcf5',
        callback: 'https://fbf297467de2.ngrok.io/refunded',
    };

    const service = PaymentFactory.getService(PaymentType.GCASH);
    const response = await service.refund(request);
    console.debug(response);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
});

test('200 SUCCESS CREDIT REFUND', async () => {
    const request = {
        transaction_id: '90f70742-c54d-4117-a6e6-a7ad024dbcf5',
        callback: 'https://fbf297467de2.ngrok.io/refunded',
    };

    const service = PaymentFactory.getService(PaymentType.CREDIT_CARD);
    const response = await service.refund(request);
    console.debug(response);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
});
