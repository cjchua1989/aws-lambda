// import { execute } from './handler';
// import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';

// test('200: SUCCESS DEFAULT PAGINATED', async () => {
//     const event: ApiGatewayEvent = {
//         body: JSON.stringify({}),
//         requestContext: {
//             authorizer: {
//                 account_id: 'TEST_ACCOUNT',
//             },
//         },
//     };

//     const result = await execute(event);
//     const response = JSON.parse(result.body);

//     expect(result).toHaveProperty('statusCode');
//     expect(result).toHaveProperty('body');
//     expect(response).toHaveProperty('code');
//     expect(response).toHaveProperty('message');
//     expect(response).toHaveProperty('data');
//     expect(response).toHaveProperty('pagination');

//     expect(result.statusCode).toBe(200);
//     expect(response.code).toBe(200);
// });

// test('200: SUCCESS PAGINATED', async () => {
//     const event: ApiGatewayEvent = {
//         body: JSON.stringify({}),
//         requestContext: {
//             authorizer: {
//                 account_id: 'TEST_ACCOUNT',
//             },
//         },
//         queryStringParameters: {
//             limit: '1',
//             page: '1',
//         },
//     };

//     const result = await execute(event);
//     const response = JSON.parse(result.body);

//     expect(result).toHaveProperty('statusCode');
//     expect(result).toHaveProperty('body');
//     expect(response).toHaveProperty('code');
//     expect(response).toHaveProperty('message');
//     expect(response).toHaveProperty('data');
//     expect(response).toHaveProperty('pagination');

//     expect(result.statusCode).toBe(200);
//     expect(response.code).toBe(200);
// });

// test('200: SUCCESS PAGINATED SEARCH', async () => {
//     const event: ApiGatewayEvent = {
//         body: JSON.stringify({}),
//         requestContext: {
//             authorizer: {
//                 account_id: 'TEST_ACCOUNT',
//             },
//         },
//         queryStringParameters: {
//             limit: '1',
//             page: '1',
//             search: 'app',
//         },
//     };

//     const result = await execute(event);
//     const response = JSON.parse(result.body);

//     expect(result).toHaveProperty('statusCode');
//     expect(result).toHaveProperty('body');
//     expect(response).toHaveProperty('code');
//     expect(response).toHaveProperty('message');
//     expect(response).toHaveProperty('data');
//     expect(response).toHaveProperty('pagination');

//     expect(result.statusCode).toBe(200);
//     expect(response.code).toBe(200);
// });
