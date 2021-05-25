import { execute } from './handler';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';
import * as faker from 'faker';
import { Bcrypt } from '../../../libs/Bcrypt';
import { UserModel } from '../../../models/UserModel';
import { Databases } from '../../../libs/Mysql';
import { UserRepository } from '../../../repositories/UserRepository';

async function seedDeleteUser(): Promise<UserModel> {
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
    const user = await seedDeleteUser();

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
    expect(response).toHaveProperty('data.user_id');
    expect(response).toHaveProperty('data.name');
    expect(response).toHaveProperty('data.email');
    expect(response).toHaveProperty('data.mobile');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});
