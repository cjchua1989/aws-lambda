import { Connection } from 'typeorm';
import { UserRepository } from '../../../repositories/UserRepository';
import { AuthAccessDenied } from './responses';
import * as bcrypt from 'bcrypt';
import { TokenData } from '../../../services/MiddlewareService';
import { JWT } from '../../../libs/JWT';
import { TokenType } from '../../../helper/Enums';
import { UserModel } from '../../../models/UserModel';

interface LoginResult {
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

    async execute(username: string, password: string): Promise<LoginResult> {
        const user = await this.repository.getUserByUserName(username);
        if (!user) throw new AuthAccessDenied();

        if (!bcrypt.compareSync(password, user.password)) throw new AuthAccessDenied();

        /**
         * Generate access and refresh tokens
         */
        const access_token = await JWT.generateToken<TokenData>({
            type: TokenType.ACCESS_TOKEN,
            user_id: user.uuid,
        });
        const refresh_token = await JWT.generateToken<TokenData>(
            {
                type: TokenType.REFRESH_TOKEN,
                user_id: user.uuid,
            },
            '30d',
        );
        return {
            user,
            access_token,
            refresh_token,
        };
    }
}
