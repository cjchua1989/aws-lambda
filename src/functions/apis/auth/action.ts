import { Connection } from 'typeorm';
import { UserRepository } from '../../../repositories/UserRepository';
import { AuthAccessDenied } from './responses';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../../../models/UserModel';
import { TokenService } from '../../../services/TokenService';

interface AuthResponse {
    user: UserModel;
    access_token: string;
    refresh_token: string;
}

export class AuthAction {
    private connection: Connection;
    private repository: UserRepository;

    constructor(connection: Connection) {
        this.connection = connection;
        this.repository = connection.getCustomRepository(UserRepository);
    }

    async execute(username: string, password: string): Promise<AuthResponse> {
        const user = await this.repository.getUserByUserName(username);
        if (!user) throw new AuthAccessDenied();

        if (!bcrypt.compareSync(password, user.password)) throw new AuthAccessDenied();

        /**
         * Generate access and refresh tokens
         */
        const access_token = await TokenService.generateAccessToken(user.uuid);
        const refresh_token = await TokenService.generateRefreshToken(user.uuid);
        return {
            user,
            access_token,
            refresh_token,
        };
    }
}
