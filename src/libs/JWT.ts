import { retrieve } from './Kms';

const API_SECRET: string = process.env.API_SECRET ?? '';
import * as jwt from 'jsonwebtoken';
import { Logger } from './Logger';
import { ApiTokenExpiredError } from './Errors/ApiTokenExpiredError';
import { ApiTokenInvalidError } from './Errors/ApiTokenInvalidError';
import { ApiTokenError } from './Errors/ApiTokenError';

export class JWT {
    static async generateToken<R>(data: R, expiresIn = '1h'): Promise<string> {
        const key = await retrieve(API_SECRET, 'API_SECRET');
        return jwt.sign(data, key, {
            expiresIn,
        });
    }

    static async verifyToken<R>(token: string): Promise<R> {
        try {
            return jwt.verify(token.replace(/^Bearer\s/, ''), await retrieve(API_SECRET, 'API_SECRET'));
        } catch (error) {
            Logger.error('JWT.getData', { error });

            switch (error.name) {
                case 'TokenExpiredError':
                    throw new ApiTokenExpiredError();
                case 'JsonWebTokenError':
                    throw new ApiTokenInvalidError();
                default:
                    throw new ApiTokenError();
            }
        }
    }
}
