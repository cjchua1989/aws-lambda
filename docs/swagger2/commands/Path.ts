export enum Method {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
}

export enum Types {
    OBJECT = 'object',
    STRING = 'string',
    ARRAY = 'array',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
}

export enum HttpStatus {
    R200 = 200,
    R201 = 201,
    R202 = 202,
    R204 = 204,
    R400 = 400,
    R401 = 401,
    R403 = 403,
    R404 = 404,
    R409 = 409,
    R410 = 410,
    R419 = 419,
    R422 = 422,
    R423 = 423,
    R500 = 500,
}

export enum StandardResponse {
    SUCCESS = 'SuccessResponse',
    CREATED = 'CreatedResponse',
    UPDATED = 'UpdatedResponse',
    DELETED = 'DeletedResponse',
    BAD_REQUEST = 'BadRequestResponse',
    UNAUTHORIZED = 'UnauthorizedResponse',
    ACCESS_DENIED = 'AccessDeniedResponse',
    NOT_FOUND = 'NotFoundResponse',
    DUPLICATE = 'DuplicateResponse',
    OTP_EXPIRED = 'OtpExpiredResponse',
    TOKEN_EXPIRED = 'TokenExpiredResponse',
    PARAMETER_ERROR = 'ParameterErrorResponse',
    MAX_TRIES = 'MaxTriesResponse',
    SERVER_ERROR = 'ServerErrorResponse',
}

interface IExamples<T> {
    DEFAULT: T;
    [key: string]: T;
}

export interface IPathData {
    method: Method;
    key: string;
    tag: string;
    description: string;
}

interface IResponse<T> {
    code: HttpStatus;
    description?: string;
    schema: string | StandardResponse;
    examples: IExamples<T>;
}

interface IHttpResponse {
    code: number;
    message: string;
    errors?: {
        [key: string]: string;
    };
}

class ResponseData<T extends IHttpResponse> implements IResponse<T> {
    code: HttpStatus;
    description: string;
    _examples: IExamples<T>;
    schema: string | StandardResponse;

    constructor(code: HttpStatus, schema: string | StandardResponse, description = '', examples: IExamples<T>) {
        this.code = code;
        this.schema = schema;
        this.description = description;
        this._examples = examples;
    }

    get examples(): any {
        const examples = {};
        for (const index in this._examples) {
            examples[index] = {
                value: this._examples[index],
            };
        }

        return examples;
    }
}

class PathData implements IPathData {
    readonly key: string;
    readonly tag: string;
    readonly description: string;
    readonly method: Method;

    constructor(method: Method, key: string, tag: string, description: string) {
        this.method = method;
        this.key = key;
        this.tag = tag;
        this.description = description;
    }
}

interface IBodyData<T> {
    schema: string;
    examples: IExamples<T>;
}

interface IQueryData<T> {
    key: string;
    type: Types;
    description: string;
    required: boolean;
    example: T;
}

class BodyData<T> implements IBodyData<T> {
    readonly schema: string;
    readonly _examples: IExamples<T>;

    constructor(schema: string, examples: IExamples<T>) {
        this.schema = schema;
        this._examples = examples;
    }

    get examples(): any {
        const examples = {};
        for (const index in this._examples) {
            examples[index] = {
                value: this._examples[index],
            };
        }

        return examples;
    }
}

class QueryData<T> implements IQueryData<T> {
    description: string;
    example: T;
    key: string;
    required: boolean;
    type: Types;

    constructor(key: string, type: Types, required = true, example: T, description = '') {
        this.key = key;
        this.type = type;
        this.required = required;
        this.example = example;
        this.description = description;
    }
}

export class Path {
    private core: IPathData;
    private body: IBodyData<unknown> | undefined;
    private queries: IQueryData<unknown>[] = [];
    private headers: IQueryData<unknown>[] = [];
    private paths: IQueryData<unknown>[] = [];
    private responses: IResponse<IHttpResponse>[] = [];

    constructor(method: Method, path: string, tag: string, description = '') {
        this.core = new PathData(method, path, tag, description);
    }

    addBody<T>(schema: string, examples: IExamples<T>): void {
        this.body = new BodyData(schema, examples);
    }

    addQuery<T>(key: string, type: Types, required: true, example: T, description = ''): void {
        this.queries.push(new QueryData<T>(key, type, required, example, description));
    }

    addPath<T>(key: string, type: Types, example: T, description = ''): void {
        this.paths.push(new QueryData<T>(key, type, true, example, description));
    }

    addHeader<T>(key: string, type: Types, required: true, example: T, description = ''): void {
        this.headers.push(new QueryData<T>(key, type, required, example, description));
    }

    addResponse<T extends IHttpResponse>(
        code: HttpStatus,
        schema: string | StandardResponse,
        description: string,
        examples: IExamples<T>,
    ): void {
        this.responses.push(new ResponseData(code, schema, description, examples));
    }

    get index(): string {
        return '/' + this.core.key;
    }

    get method(): string {
        return this.core.method;
    }

    get compile(): any {
        const data: any = {
            tags: [this.core.tag],
            summary: this.core.description,
        };

        if (this.body) {
            data.requestBody = {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/' + this.body.schema,
                        },
                        examples: this.body.examples,
                    },
                },
            };
        }

        if (this.queries.length > 0 || this.headers.length > 0 || this.paths.length > 0) {
            data.parameters = [];

            for (const query of this.queries) {
                data.parameters.push({
                    in: 'query',
                    required: query.required,
                    name: query.key,
                    description: query.description,
                    example: query.example,
                    schema: {
                        type: query.type,
                    },
                });
            }

            for (const header of this.headers) {
                data.parameters.push({
                    in: 'header',
                    required: header.required,
                    name: header.key,
                    description: header.description,
                    example: header.example,
                    schema: {
                        type: header.type,
                    },
                });
            }

            for (const path of this.paths) {
                data.parameters.push({
                    in: 'path',
                    required: path.required,
                    name: path.key,
                    description: path.description,
                    example: path.example,
                    schema: {
                        type: path.type,
                    },
                });
            }
        }

        if (this.responses.length > 0) {
            data.responses = {};
            for (const response of this.responses) {
                data.responses[response.code] = {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/' + response.schema,
                            },
                            examples: response.examples,
                        },
                    },
                    description: response.description,
                };
            }
        }

        return data;
    }
}
