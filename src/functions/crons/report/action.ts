import { Connection } from 'typeorm';
import { UserRepository } from '../../../repositories/UserRepository';

export class ReportAction {
    private connection: Connection;
    private userRepository: UserRepository;

    constructor(connection: Connection) {
        this.connection = connection;
        this.userRepository = connection.getCustomRepository(UserRepository);
    }

    async execute(): Promise<void> {
        // Do something here to generate the reports
    }
}
