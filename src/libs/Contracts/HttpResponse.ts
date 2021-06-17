export interface HttpResponse {
    statusCode?: number;
    code: number;
    message: string;
    [key: string]: unknown;
}
