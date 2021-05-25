import { execute } from './handler';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';
import { RegisterRequest } from './requests';
import * as faker from 'faker';
import { Bcrypt } from '../../../libs/Bcrypt';
import { UserSeeder } from '../../../seeders/UserSeeder';

test('409: EXISTING EMAIL', async () => {
    const user = await UserSeeder.seedUser();

    const event: ApiGatewayEvent = {
        body: JSON.stringify(<RegisterRequest>{
            name: faker.name.firstName(),
            email: user.email,
            mobile: `09${faker.random.number(999999999).toString().padStart(9, '0')}`,
            password: Bcrypt.generate(faker.random.alphaNumeric(18)),
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');

    expect(result.statusCode).toBe(409);
    expect(response.code).toBe(409);
});

test('409: EXISTING MOBILE', async () => {
    const user = await UserSeeder.seedUser();

    const event: ApiGatewayEvent = {
        body: JSON.stringify(<RegisterRequest>{
            name: faker.name.firstName(),
            email: faker.internet.email(),
            mobile: user.mobile,
            password: Bcrypt.generate(faker.random.alphaNumeric(18)),
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');

    expect(result.statusCode).toBe(409);
    expect(response.code).toBe(409);
});

test('422: PARAMETER ERROR', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify({}),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('errors');
    expect(response).toHaveProperty('errors.name');
    expect(response).toHaveProperty('errors.email');
    expect(response).toHaveProperty('errors.mobile');

    expect(result.statusCode).toBe(422);
    expect(response.code).toBe(422);
});

test('200: SUCCESS', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<RegisterRequest>{
            name: faker.name.firstName(),
            email: faker.internet.email(),
            mobile: `09${faker.random.number(999999999).toString().padStart(9, '0')}`,
            password: Bcrypt.generate(faker.random.alphaNumeric(18)),
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data'); // Add the required fields
    expect(response).toHaveProperty('data.user_id');
    expect(response).toHaveProperty('data.name');
    expect(response).toHaveProperty('data.email');
    expect(response).toHaveProperty('data.mobile');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});
