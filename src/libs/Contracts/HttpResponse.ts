export interface HttpResponse {
    code: number;
    message: string;
    [key: string]: unknown;
}
