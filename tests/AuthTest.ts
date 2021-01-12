import { execute } from '../src/functions/apis/auth/handler';
import { ApiGatewayEvent } from '../src/libs/Contracts/ApiGatewayEvent';
import { expect } from 'chai';
import * as faker from 'faker';


describe('Auth Handler', () => {
    it('422: ParameterError', async () => {
        const payload: ApiGatewayEvent = {
            body: '{}',
        };

        const response = await execute(payload);
        const body = JSON.parse(response.body);

        expect(response.statusCode).to.be.equal(422);
        expect(body).to.have.all.keys('code', 'message', 'errors');
        expect(body.code).to.be.equal(422);
        expect(body.errors).to.have.all.keys('username', 'password');
    });

    it('401: Access Denied', async () => {
        const payload: ApiGatewayEvent = {
            body: JSON.stringify({
                username: faker.internet.email(),
                password: faker.random.alphaNumeric(10),
            }),
        };

        const response = await execute(payload);
        const body = JSON.parse(response.body);

        expect(response.statusCode).to.be.equal(401);
        expect(body).to.have.all.keys('code', 'message');
        expect(body.code).to.be.equal(401);
    });

    it('200: Success', async () => {
        const payload: ApiGatewayEvent = {
            body: JSON.stringify({
                username: 'example@example.com',
                password: 'password',
            }),
        };

        const response = await execute(payload);
        const body = JSON.parse(response.body);

        expect(response.statusCode).to.be.equal(200);
        expect(body).to.have.all.keys('code', 'message', 'user');
        expect(body.code).to.be.equal(200);
        expect(body.user).to.have.all.keys('name', 'email', 'mobile');
    });
});
