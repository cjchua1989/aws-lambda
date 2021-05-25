import { UserModel } from '../models/UserModel';
import { Databases } from '../libs/Mysql';
import { UserRepository } from '../repositories/UserRepository';
import * as faker from 'faker';
import { Bcrypt } from '../libs/Bcrypt';

export class UserSeeder {
    static async seedUser(): Promise<UserModel> {
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
}
