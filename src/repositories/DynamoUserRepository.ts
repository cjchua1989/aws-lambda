import { DynamoUserModel, LOOKUP_KEY } from '../models/DynamoUserModel';
import { DynamoRepository, DynamoPaginationInfo } from './DynamoRepository';

export class DynamoUserRepository extends DynamoRepository<DynamoUserModel> {
    async getPaginateList(
        page_info: DynamoPaginationInfo,
    ): Promise<{ limit: number; key: string; forward: boolean; data: DynamoUserModel[] }> {
        const item = await this.paginateQuery(page_info, 'lookup_key = :lookup_key', {
            ':lookup_key': LOOKUP_KEY,
        });

        const data =
            item.data?.map((item) => {
                return Object.assign(new DynamoUserModel(), item);
            }) || [];

        return {
            limit: page_info.limit,
            key: item.key,
            forward: item.forward,
            data,
        };
    }
}
