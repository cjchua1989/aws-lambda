import { Logger } from './Logger';
import { Schema } from 'joi';
import { HttpRequest } from './Contracts/HttpRequest';
import { ParameterError } from './Errors/ParameterError';

export class Validation<R extends HttpRequest> {
    private schema: Schema;

    constructor(schema: Schema) {
        this.schema = schema;
    }

    validate(request: R): R {
        Logger.info('Validation.request', { request });

        const { value, error } = this.schema.validate(request, {
            abortEarly: false,
            errors: {
                wrap: {
                    label: '',
                },
            },
        });

        if (error) {
            Logger.error('Validation.validate', { request, error });
            throw new ParameterError(error.details);
        }

        return value;
    }
}
