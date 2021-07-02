import { UserModel } from '../models/UserModel';
import { Databases } from '../libs/Mysql';
import { UserRepository } from '../repositories/UserRepository';
import * as faker from 'faker';
import { Bcrypt } from '../libs/Bcrypt';

export class UserSeeder {
    static async seed(): Promise<UserModel> {
        const connection = await Databases.getConnection();
        const repository = connection.getCustomRepository(UserRepository);

        const user = new UserModel();
        user.name = faker.name.firstName();
        user.email = faker.internet.email();
        user.mobile = `09${faker.datatype.number(999999999).toString().padStart(9, '0')}`;
        user.password = Bcrypt.generateHashPassword('1234');
        await repository.save(user);
        await Databases.closeConnection();
        return user;
    }

    static async seedMultipleUserData(): Promise<void> {
        const connection = await Databases.getConnection();
        const repository = connection.getCustomRepository(UserRepository);
        const users: UserModel[] = [];

        for (let i = 0; i < 15; i++) {
            const user = new UserModel();
            user.name = faker.name.firstName();
            user.email = faker.internet.email();
            user.mobile = `09${faker.datatype.number(999999999).toString().padStart(9, '0')}`;
            user.password = Bcrypt.generateHashPassword('1234');
            users.push(user);
        }

        await repository.save(users);
        await Databases.closeConnection();
    }
}
