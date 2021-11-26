import { execute } from './handler';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';

test('200: SUCCESS', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify({}),
        queryStringParameters: {
            page: '1',
            limit: '2',
        },
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('pagination');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});
