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

    async checkExist(column): Promise<boolean> {
        const count = await this.count({
            where: column,
        });

        return count > 0;
    }

    async deleteUser(uuid: string): Promise<UserModel> {
        const user = await this.findOneOrFail({
            uuid: uuid,
        });
        await this.softDelete(user);
        return user;
    }
}
