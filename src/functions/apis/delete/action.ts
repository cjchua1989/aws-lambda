import { Connection } from 'typeorm';
import { DeleteRequest } from './requests';
import { UserRepository } from '../../../repositories/UserRepository';
import { UserNotExist } from './responses';

interface OutputData {
    user_id: string;
    name: string;
    email: string;
    mobile: string;
}

export class DeleteAction {
    private connection: Connection;
    private repository: UserRepository;

    constructor(connection: Connection) {
        this.connection = connection;
        this.repository = connection.getCustomRepository(UserRepository);
    }

    async execute(uuid: string): Promise<OutputData> {
        const userExist = await this.repository.checkExist({ uuid: uuid });
        if (!userExist) throw new UserNotExist();

        const user = await this.repository.deleteUser(uuid);

        return {
            user_id: user.uuid,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        };
    }
}
