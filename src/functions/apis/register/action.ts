import { Connection } from 'typeorm';
import { RegisterRequest } from './requests';
import { UserRepository } from '../../../repositories/UserRepository';
import { EmailExist, MobileExist } from './responses';
import { UserModel } from '../../../models/UserModel';
import { Bcrypt } from '../../../libs/Bcrypt';

interface OutputData {
    user_id: string;
    name: string;
    email: string;
    mobile: string;
}

export class RegisterAction {
    private connection: Connection;
    private repository: UserRepository;

    constructor(connection: Connection) {
        this.connection = connection;
        this.repository = connection.getCustomRepository(UserRepository);
    }

    async execute(request: RegisterRequest): Promise<OutputData> {
        const emailExist = await this.repository.checkExist({ email: request.email });
        if (emailExist) throw new EmailExist();

        const mobileExist = await this.repository.checkExist({ mobile: request.mobile });
        if (mobileExist) throw new MobileExist();

        const user = new UserModel();

        user.name = request.name;
        user.email = request.email;
        user.mobile = request.mobile;
        user.password = Bcrypt.generateHashPassword(request.password);

        await user.save();

        return {
            user_id: user.uuid,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        };
    }
}
