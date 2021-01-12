import { Connection } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import { AuthAccessDenied } from '../errors/AuthAccessDenied';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../models/UserModel';

export class UserService {
    private connection: Connection;
    private repository: UserRepository;

    constructor(connection: Connection) {
        this.connection = connection;
        this.repository = connection.getCustomRepository(UserRepository);
    }

    async login(username: string, password: string): Promise<UserModel> {
        const user = await this.repository.getUserByUserName(username);
        if (!user) throw new AuthAccessDenied();

        if (!bcrypt.compareSync(password, user.password)) throw new AuthAccessDenied();
        return user;
    }
}
