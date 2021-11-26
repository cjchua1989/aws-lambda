import { AuthRequest, AuthResponse } from './contract';
import * as faker from 'faker';

export class Generator {
    static request(): AuthRequest {
        return {
            key: faker.random.alphaNumeric(18),
            secret: faker.random.alphaNumeric(88),
        };
    }

    static response(): AuthResponse {
        return {
            access_token: faker.random.alphaNumeric(500),
            refresh_token: faker.random.alphaNumeric(500),
        };
    }
}
