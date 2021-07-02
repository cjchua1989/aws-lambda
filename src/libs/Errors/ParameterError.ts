import { ValidationErrorItem } from 'joi';
import * as dot from 'dot-object';

export interface ErrorObjects {
    [propName: string]: string | ErrorObjects;
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
            dot.str(error.path.join('.'), error.message, this.errors);
        }
    }
}
