import { LogisticFactory, LogisticPaymentType, LogisticType } from './LogisticFactory';
import * as faker from 'faker';

test('200 SUCCESS QUOTATION', async () => {
    const request = {
        channel: faker.helpers.randomize([LogisticType.GRAB, LogisticType.MR_SPEEDY, LogisticType.NINJA_VAN]),
        packages: [
            {
                code: 'o8mpy4a1qo',
                name: '2mvmaqh38t19f4ndcaq69210fx6k34wyc3ty7z2y',
                description: 'A repudiandae quo sint quos.',
                quantity: 1,
                price: 0,
                dimensions: {
                    height: 3,
                    width: 2,
                    depth: 6,
                    weight: 5,
                },
            },
        ],
        origin: {
            address: {
                address1: '4F Uptown Place Mall',
                address2: '',
                barangay: '',
                city_municipality: 'Taguig',
                province: 'Metro Manila',
            },
            coordinates: {
                latitude: 14.557143769031468,
                longitude: 121.05432015697117,
            },
        },
        destination: {
            address: {
                address1: 'McKinley Pkwy',
                address2: '',
                barangay: '',
                city_municipality: 'Taguig',
                province: 'Metro Manila',
            },
            coordinates: {
                latitude: 14.54991609927194,
                longitude: 121.05577927868111,
            },
        },
        cash_on_delivery: 100,
    };

    const service = LogisticFactory.getService(request.channel);
    const response = await service.quotation(request);
    console.debug(response);
});

test('200 SUCCESS BOOK DELIVERY', async () => {
    const request = {
        merchant_id: 'VCD2EMU2BPO05IWUPKAWW0Q7R5YWKL1C',
        sender: {
            mobile: '09123456789',
            last_name: 'Lang',
            first_name: 'Jade',
            email: 'Eryn_Crona@yahoo.com',
        },
        recipient: {
            mobile: '09123456789',
            last_name: 'Rutherford',
            first_name: 'Gia',
            email: 'Pink_Crooks67@yahoo.com',
        },
        payment_method: faker.helpers.randomize([LogisticPaymentType.CASH, LogisticPaymentType.CASHLESS]),
        channel: faker.helpers.randomize([LogisticType.GRAB, LogisticType.MR_SPEEDY, LogisticType.NINJA_VAN]),
        packages: [
            {
                code: 'o8mpy4a1qo',
                name: '2mvmaqh38t19f4ndcaq69210fx6k34wyc3ty7z2y',
                description: 'A repudiandae quo sint quos.',
                quantity: 1,
                price: 0,
                dimensions: {
                    height: 3,
                    width: 2,
                    depth: 6,
                    weight: 5,
                },
            },
        ],
        origin: {
            address: {
                address1: '4F Uptown Place Mall',
                address2: '',
                barangay: '',
                city_municipality: 'Taguig',
                province: 'Metro Manila',
            },
            coordinates: {
                latitude: 14.557143769031468,
                longitude: 121.05432015697117,
            },
        },
        destination: {
            address: {
                address1: 'McKinley Pkwy',
                address2: '',
                barangay: '',
                city_municipality: 'Taguig',
                province: 'Metro Manila',
            },
            coordinates: {
                latitude: 14.54991609927194,
                longitude: 121.05577927868111,
            },
        },
    };

    const service = LogisticFactory.getService(request.channel);
    const response = await service.bookDelivery(request);
    console.debug(response);
});

test('200 SUCCESS GET DELIVERY', async () => {
    const request = {
        transaction_id: '37d528f3-99f1-4edc-83f2-f7f6e78d120e',
        channel: LogisticType.NINJA_VAN,
    };

    const service = LogisticFactory.getService(request.channel);
    const response = await service.getDelivery(request.transaction_id);
    console.debug(response);
});

test('200 SUCCESS DELETE DELIVERY', async () => {
    const request = {
        transaction_id: '37d528f3-99f1-4edc-83f2-f7f6e78d120e',
        channel: LogisticType.NINJA_VAN,
    };

    const service = LogisticFactory.getService(request.channel);
    const response = await service.cancelDelivery(request.transaction_id);
    console.debug(response);
});
