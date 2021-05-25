import { execute } from './handler';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';
import * as faker from 'faker';
import { UserSeeder } from '../../../seeders/UserSeeder';

test('409: NOT EXISTING USER', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify({}),
        pathParameters: {
            id: faker.random.uuid(),
        },
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

test('200: SUCCESS', async () => {
    const user = await UserSeeder.seedUser();

    const event: ApiGatewayEvent = {
        body: JSON.stringify({}),
        pathParameters: {
            id: user.uuid,
        },
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('data.name');
    expect(response).toHaveProperty('data.email');
    expect(response).toHaveProperty('data.mobile');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});
