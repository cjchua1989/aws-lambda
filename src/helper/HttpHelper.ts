const PAGE_LIMIT: string = process.env.PAGE_LIMIT ?? '';

interface QueryPaginationKeys {
    page: number;
    limit: number;
}

interface QueryPaginationDynamoKeys {
    page: string;
    limit: number;
    key: string;
    forward: boolean;
}

export interface PaginationQuery {
    page?: string;
    limit?: string;
    search?: string;
    next_key?: string;
    prev_key?: string;
    forward?: string;
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
        const query = queryStringParameters
            ? queryStringParameters
            : { page: 'NEXT', limit: PAGE_LIMIT, key: '', forward: 'true' };
        const page = query.page ? query.page : 'NEXT';
        const limit = query.limit ? parseInt(query.limit.trim()) : parseInt(PAGE_LIMIT);
        const key = query.key ? query.key : '';
        const forward = query.forward ? (query.forward === 'true' ? true : false) : true;
        return {
            page,
            limit,
            key,
            forward,
        };
    }
}
