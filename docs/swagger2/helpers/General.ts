import { IHttpResponse } from '../commands/Path';

export interface Pagination {
    current_page: number;
    max_page: number;
}

export interface Paginated<T> extends IHttpResponse {
    pagination: Pagination;
    data: T[];
}

export interface SingleData<T> extends IHttpResponse {
    data: T;
}

export interface ListData<T> extends IHttpResponse {
    data: T[];
}

export function generatePaginated<T>(data: T[]): Paginated<T> {
    return {
        data,
        pagination: {
            max_page: 10,
            current_page: 1,
        },
    };
}
