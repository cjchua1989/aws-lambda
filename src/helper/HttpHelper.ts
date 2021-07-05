const PAGE_LIMIT: string = process.env.PAGE_LIMIT ?? '';

interface QueryPaginationKeys {
    page: number;
    limit: number;
}

interface QueryPaginationDynamoKeys {
    page: string;
    limit: number;
    key: string;
}

export interface PaginationQuery {
    page?: string;
    limit?: string;
    search?: string;
    next_key?: string;
    prev_key?: string;
    [key: string]: string | undefined;
}

export class HttpRequestHelper {
    static extractPagination<T extends PaginationQuery>(queryStringParameters: T): QueryPaginationKeys {
        const query = queryStringParameters ? queryStringParameters : { page: '1', limit: PAGE_LIMIT };
        const page = query.page ? parseInt(query.page.trim()) : 1;
        const limit = query.limit ? parseInt(query.limit.trim()) : parseInt(PAGE_LIMIT);
        return {
            page,
            limit,
        };
    }

    static extractDynamoPagination<T extends PaginationQuery>(queryStringParameters: T): QueryPaginationDynamoKeys {
        const query = queryStringParameters ? queryStringParameters : { page: 'next', limit: PAGE_LIMIT, key: '' };
        const page = query.page ? query.page : 'next';
        const limit = query.limit ? parseInt(query.limit.trim()) : parseInt(PAGE_LIMIT);
        const key = query.key ? query.key : '';
        return {
            page,
            limit,
            key,
        };
    }
}
