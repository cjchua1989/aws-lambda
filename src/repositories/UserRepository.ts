import { EntityRepository, Repository } from 'typeorm';
import { UserModel } from '../models/UserModel';

@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {
    async getUserByUserName(username: string): Promise<UserModel | undefined> {
        return this.createQueryBuilder('users')
            .where('users.email = :username', { username })
            .orWhere('users.mobile = :username', { username })
            .getOne();
    }
}
