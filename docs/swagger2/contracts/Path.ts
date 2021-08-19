import { example } from 'joi';

export enum METHOD {
    post = 'post',
    get = 'get',
    put = 'put',
    delete = 'delete',
}

export interface ExampleParameter<E> {
    id: string;
    example: E;
}

export interface BodyParameter<E extends ExampleParameter<unknown>> {
    schema: string;
    examples?: E[];
}

export interface Parameter {

}

export interface Parameters {
    body?: BodyParameter<unknown>;
    pathParameter?: Parameter;
}

export enum Code {
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
    R423 = 423,
    R422 = 422,
}

export interface Example {
    code: number;
    message: string;
}

export interface Response<E extends Example> {
    description?: string;
    schema: string;
    example?: E;
}

export interface Responses {
    [key: number]: Response<Example>;
}

export class Path {
    private key: string;
    private summary: string;
    private method: METHOD;
    private tag: string;
    private parameters: Parameters = {};
    private responses: Responses;

    constructor(key: string, method: METHOD, tag: string, summary?: string) {
        this.key = key;
        this.method = method;
        this.tag = tag;
        this.summary = summary ?? '';
    }

    addBody<A extends ExampleParameter<unknown>>(schema: string, examples?: A[]): Path {
        this.parameters.body = <BodyParameter<A>>{
            schema,
            examples,
        };
        return this;
    }
}
