import { EntityRepository } from 'typeorm';
import { RdsRepository, PaginationInfo, PagenateResult } from './RdsRepository';
import { UserModel } from '../models/UserModel';

@EntityRepository(UserModel)
export class UserRepository extends RdsRepository<UserModel> {
    async getPaginatedList(
        page_info: PaginationInfo,
    ): Promise<{ max_page: number; current_page: number; data: UserModel[] }> {
        const query = this.createQueryBuilder('a').orderBy('a.id', 'DESC');
        return await PagenateResult<UserModel>(query, page_info);
    }

    async getUserByUserName(username: string): Promise<UserModel | undefined> {
        return this.createQueryBuilder('users')
            .where('users.email = :username', { username })
            .orWhere('users.mobile = :username', { username })
            .getOne();
    }

    async getUserByUserId(uuid: string): Promise<UserModel | undefined> {
        return this.createQueryBuilder('users').where('users.uuid = uuid', { uuid }).getOne();
    }
}
