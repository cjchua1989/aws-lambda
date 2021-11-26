import { execute } from './handler';

test('200: SUCCESS', async () => {
    const response = await execute();

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');

    expect(response.code).toBe(200);
});
