import { pascalCase } from 'case-anything';
import * as faker from 'faker';

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
    SUCCESS = 200,
    CREATED = 201,
    UPDATED = 202,
    DELETED = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    ACCESS_DENIED = 403,
    NOT_FOUND = 404,
    DUPLICATE = 409,
    OTP_EXPIRED = 410,
    TOKEN_EXPIRED = 419,
    PARAMETER_ERROR = 422,
    MAX_TRIES = 423,
    SERVER_ERROR = 500,
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
    examples: ICompileExamples<T>;
}

interface IErrors {
    [key: string]: string;
}

export interface IHttpResponse {
    code?: number;
    message?: string;
    errors?: IErrors;
}

interface ICompileExamples<T> {
    [key: string]: {
        value: T;
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

    get examples(): ICompileExamples<T> {
        const examples: ICompileExamples<T> = {};
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
    examples: ICompileExamples<T>;
}

interface IQueryData<T> {
    key: string;
    type: Types;
    description: string;
    required: boolean;
    example: T;
    enumerate?: T[];
}

class BodyData<T> implements IBodyData<T> {
    readonly schema: string;
    readonly _examples: IExamples<T>;

    constructor(schema: string, examples: IExamples<T>) {
        this.schema = schema;
        this._examples = examples;
    }

    get examples(): ICompileExamples<T> {
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
    enumerate?: T[];

    constructor(key: string, type: Types, required = true, example: T, description = '', enumerate?: T[]) {
        this.key = key;
        this.type = type;
        this.required = required;
        this.example = example;
        this.description = description;
        this.enumerate = enumerate;
    }
}

interface IContent {
    'application/json': {
        schema: {
            $ref: string;
        };
        examples: ICompileExamples<unknown>;
    };
}

interface ISecurity {
    [key: string]: string[];
}

interface ICompilePath {
    tags: string[];
    summary: string;
    requestBody?: {
        content: {
            'application/json'?: {
                schema: {
                    $ref: string;
                };
                examples: ICompileExamples<unknown>;
            };
        };
    };
    parameters?: {
        in: 'query' | 'header' | 'path';
        required: boolean;
        name: string;
        description: string;
        examples?: {
            DEFAULT: {
                value: unknown;
            };
        };
        schema: {
            type: Types;
            enumerate?: unknown[];
        };
    }[];
    responses?: {
        [key: string]: {
            content?: IContent;
            description?: string;
        };
    };
    security?: ISecurity[];
}

export class Path {
    private core: IPathData;
    private body: IBodyData<unknown> | undefined;
    private queries: IQueryData<unknown>[] = [];
    private headers: IQueryData<unknown>[] = [];
    private paths: IQueryData<unknown>[] = [];
    private responses: IResponse<IHttpResponse>[] = [];
    private secuity: string[];

    constructor(method: Method, path: string, tag: string, description = '') {
        this.core = new PathData(method, path, tag, description);
        this.addStandardResponse(HttpStatus.SERVER_ERROR, 'Something went wrong, please try again');
    }

    addBody<T>(examples: T): void {
        this.body = new BodyData(this.request, <IExamples<T>>{
            DEFAULT: examples,
        });
    }

    addQuery<T>(key: string, type: Types, required = true, example: T, description = '', enumerate?: T[]): void {
        this.queries.push(new QueryData<T>(key, type, required, example, description, enumerate));
    }

    addPath<T>(key: string, type: Types, example: T, description = ''): void {
        this.paths.push(new QueryData<T>(key, type, true, example, description));
    }

    addHeader<T>(key: string, type: Types, required: true, example: T, description = ''): void {
        this.headers.push(new QueryData<T>(key, type, required, example, description));
    }

    addResponse<T extends IHttpResponse>(
        code: HttpStatus,
        message: string,
        examples: T,
        index = 'DEFAULT',
        schema?: string,
    ): void {
        this.responses.push(
            new ResponseData(code, schema ?? this.response, message, <IExamples<T>>{
                [index]: {
                    code,
                    message,
                    ...examples,
                },
            }),
        );
    }

    parseSchema(code: HttpStatus): StandardResponse {
        switch (code) {
            case HttpStatus.SUCCESS:
                return StandardResponse.SUCCESS;
            case HttpStatus.CREATED:
                return StandardResponse.CREATED;
            case HttpStatus.UPDATED:
                return StandardResponse.UPDATED;
            case HttpStatus.DELETED:
                return StandardResponse.DELETED;
            case HttpStatus.BAD_REQUEST:
                return StandardResponse.BAD_REQUEST;
            case HttpStatus.UNAUTHORIZED:
                return StandardResponse.UNAUTHORIZED;
            case HttpStatus.ACCESS_DENIED:
                return StandardResponse.ACCESS_DENIED;
            case HttpStatus.NOT_FOUND:
                return StandardResponse.NOT_FOUND;
            case HttpStatus.DUPLICATE:
                return StandardResponse.DUPLICATE;
            case HttpStatus.OTP_EXPIRED:
                return StandardResponse.OTP_EXPIRED;
            case HttpStatus.TOKEN_EXPIRED:
                return StandardResponse.TOKEN_EXPIRED;
            case HttpStatus.PARAMETER_ERROR:
                return StandardResponse.PARAMETER_ERROR;
            case HttpStatus.MAX_TRIES:
                return StandardResponse.MAX_TRIES;
            case HttpStatus.SERVER_ERROR:
                return StandardResponse.SERVER_ERROR;
        }
    }

    get index(): string {
        return '/v2/' + this.core.key;
    }

    get method(): string {
        return this.core.method;
    }

    get compile(): ICompilePath {
        const data: ICompilePath = {
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

            for (const path of this.paths) {
                data.parameters.push({
                    in: 'path',
                    required: path.required,
                    name: path.key,
                    description: path.description,
                    examples: {
                        DEFAULT: {
                            value: path.example,
                        },
                    },
                    schema: {
                        type: path.type,
                    },
                });
            }

            for (const header of this.headers) {
                data.parameters.push({
                    in: 'header',
                    required: header.required,
                    name: header.key,
                    description: header.description,
                    examples: {
                        DEFAULT: {
                            value: header.example,
                        },
                    },
                    schema: {
                        type: header.type,
                    },
                });
            }

            for (const query of this.queries) {
                const schema: {
                    type: Types;
                    enum?: unknown[];
                } = {
                    type: query.type,
                };

                if (query.enumerate) schema.enum = query.enumerate;

                data.parameters.push({
                    in: 'query',
                    required: query.required,
                    name: query.key,
                    description: query.description,
                    examples: {
                        DEFAULT: {
                            value: query.example,
                        },
                    },
                    schema,
                });
            }
        }

        if (this.responses.length > 0) {
            data.responses = {};
            for (const response of this.responses) {
                if (data.responses[response.code]) {
                    const item = data.responses[response.code];
                    if (item.content) {
                        item['content']['application/json'].examples = {
                            ...item.content['application/json'].examples,
                            ...response.examples,
                        };
                        data.responses[response.code] = item;
                        continue;
                    }
                }

                if (response.code == HttpStatus.DELETED) {
                    data.responses[response.code] = {
                        description: response.description,
                    };
                    continue;
                }

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

        if (this.secuity) {
            data.security = [];
            for (const index of this.secuity) {
                data.security.push({
                    [index]: [],
                });
            }
        }

        return data;
    }

    get response(): string {
        return pascalCase(this.constructor.name + 'Response');
    }

    get request(): string {
        return pascalCase(this.constructor.name + 'Request');
    }

    addParameterError(errors: IErrors): void {
        this.addResponse(
            HttpStatus.PARAMETER_ERROR,
            'Parameter Error',
            {
                code: HttpStatus.PARAMETER_ERROR,
                message: 'Parameter Error',
                errors,
            },
            'DEFAULT',
            this.parseSchema(HttpStatus.PARAMETER_ERROR),
        );
    }

    addStandardResponse(code: HttpStatus, message: string, custom_code?: number, index = 'DEFAULT'): void {
        this.addResponse(
            code,
            message,
            {
                code: custom_code ?? code,
                message,
            },
            index,
            this.parseSchema(code),
        );
    }

    addAuthorizedResponse(roles: string[]): void {
        this.roles = roles;
        this.addHeader<string>(
            'Authorization',
            Types.STRING,
            true,
            'Bearer ' + faker.random.alphaNumeric(100),
            'JWT Token provide after login',
        );
        this.addStandardResponse(HttpStatus.UNAUTHORIZED, 'Missing authorization header');
        this.addStandardResponse(HttpStatus.ACCESS_DENIED, 'Invalid authorization header');
    }

    set roles(roles: string[]) {
        this.secuity = roles;
    }

    addPagination(): void {
        this.addQuery<number>('limit', Types.NUMBER, false, 50, 'Limit the number of result per page, max 50');
        this.addQuery<number>('page', Types.NUMBER, false, 1, 'Page to be accessed, default set to 1');
    }

    addSearch(): void {
        this.addQuery<string>('search', Types.STRING, false, 'Sample', 'Term to search');
    }
}
