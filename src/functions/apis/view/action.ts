import { Connection } from 'typeorm';
import { UserRepository } from '../../../repositories/UserRepository';
import { UserNotExist } from '../view/responses';

interface OutputData {
    id: string;
    name: string;
    email: string;
    mobile: string;
    email_verified_at: string;
    mobile_verified_at: string;
}

export class ViewAction {
    private connection: Connection;
    private repository: UserRepository;

    constructor(connection: Connection) {
        this.connection = connection;
        this.repository = connection.getCustomRepository(UserRepository);
    }

    async execute(uuid: string): Promise<OutputData> {
        const idExist = await this.repository.checkExist({ uuid: uuid });
        if (!idExist) throw new UserNotExist();

        const user = await this.repository.getUserByUuid(uuid);

        return {
            id: user.uuid,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            email_verified_at: user.mobile,
            mobile_verified_at: user.mobile,
        };
    }
}
