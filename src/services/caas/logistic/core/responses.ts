export interface LogisticResponse {
    code: number;
    message: string;
    data?: Array<unknown>;
}

export class LogisticNotFound {
    code = 404;
    message = 'Logistic Not Found';
}
