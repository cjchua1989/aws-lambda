import { ValidationErrorItem } from 'joi';

export interface ErrorObjects {
    [propName: string]: string;
}

export class ParameterError {
    public code: number;
    public errors: ErrorObjects = {};
    public message: string;

    public constructor(errors: ValidationErrorItem[]) {
        this.message = 'Parameter error: Please provide required parameter';
        this.code = 422;

        for (let i = 0; i < errors.length; i += 1) {
            const error = errors[i];
            const key = error.context && error.context.key ? error.context.key : undefined;
            if (key) this.errors[key] = error.message;
        }
    }
}
