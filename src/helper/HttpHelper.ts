const PAGE_LIMIT: string = process.env.PAGE_LIMIT ?? '';

interface QueryPaginationKeys {
    page: number;
    limit: number;
}

export interface PaginationQuery {
    page?: string;
    limit?: string;
    search?: string;
    [key: string]: string | undefined;
}

export class HttpRequestHelper {
    static extractPagination<T extends PaginationQuery>(queryStringParameters: T): QueryPaginationKeys {
        const query = queryStringParameters ? queryStringParameters : { page: '1', limit: PAGE_LIMIT };
        const page = query.page ? parseInt(query.page.trim()) : 1;
        const limit = query.limit ? parseInt(query.limit.trim()) : 50;
        return {
            page,
            limit,
        };
    }
}
