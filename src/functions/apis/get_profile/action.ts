import { Connection } from 'typeorm';
import { UserRepository } from '../../../repositories/UserRepository';
import { UserNotFound } from './responses';
import { UserModel } from '../../../models/UserModel';

export class GetProfileAction {
    private connection: Connection;
    private repository: UserRepository;

    constructor(connection: Connection) {
        this.connection = connection;
        this.repository = connection.getCustomRepository(UserRepository);
    }

    async execute(user_id: string): Promise<UserModel> {
        const user = await this.repository.getUserByUserId(user_id);
        if (!user) throw new UserNotFound();

        return user;
    }
}
