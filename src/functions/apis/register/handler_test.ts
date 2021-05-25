import { execute } from './handler';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';
import { RegisterRequest } from './requests';
import * as faker from 'faker';
import { UserModel } from '../../../models/UserModel';
import { Databases } from '../../../libs/Mysql';
import { UserRepository } from '../../../repositories/UserRepository';
import { Bcrypt } from '../../../libs/Bcrypt';

async function seedUser(): Promise<UserModel> {
    const connection = await Databases.getConnection();
    const repository = connection.getCustomRepository(UserRepository);
    const user = new UserModel();

    user.name = faker.name.firstName();
    user.email = faker.internet.email();
    user.mobile = `09${faker.random.number(999999999).toString().padStart(9, '0')}`;
    user.password = Bcrypt.generate(faker.random.alphaNumeric(18));
    await repository.save(user);

    return user;
}

test('409: EXISTING EMAIL', async () => {
    const user = await seedUser();

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
    const user = await seedUser();

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
