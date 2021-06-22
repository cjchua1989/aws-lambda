import { execute } from './handler';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';
import { UserSeeder } from '../../../seeder/UserSeeder';

test('200: SUCCESS', async () => {
    const user = await UserSeeder.seed();

    const event: ApiGatewayEvent = {
        body: JSON.stringify({}),
        requestContext: {
            authorizer: {
                user_id: user.uuid,
            },
        },
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('data.user');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});
