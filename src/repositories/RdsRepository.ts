import { Repository, SelectQueryBuilder } from 'typeorm';

export interface PaginationInfo {
    page: number;
    limit: number;
}

export async function PagenateResult<T>(
    query: SelectQueryBuilder<T>,
    page_info: PaginationInfo,
): Promise<{ max_page: number; current_page: number; data: T[] }> {
    let max_page = 1;
    if (page_info.page && page_info.limit && page_info.limit > 0) {
        const page = page_info.page < 1 ? 0 : page_info.page - 1;
        page_info.limit = page_info.limit > 50 || page_info.limit < 1 ? 50 : page_info.limit;
        const offset = page_info.limit * page;
        query.offset(offset);
        const count = await query.getCount();
        const modulus = count % page_info.limit;
        max_page = (count - modulus) / page_info.limit + (modulus ? 1 : 0);
        query.limit(page_info.limit);
    }
    const data = await query.getMany();
    return { max_page, data, current_page: page_info.page };
}

export class RdsRepository<T> extends Repository<T> {}
