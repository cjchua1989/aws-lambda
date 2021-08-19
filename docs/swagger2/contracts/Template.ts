interface License {
    name: string;
    url: string;
}
interface Contact {
    name: string;
    url: string;
    email: string;
}

interface InfoObject {
    title: string;
    description: string;
    termsOfService: string;
    contact: Contact;
    license: License;
    version: string;
}

interface ServerObject {
    url: string;
    description: string;
}

interface RequestBodyObject {
}

interface ResponsesObject {

}

interface OperationObject {
    tags: string[];
    summary: string;
    description?: string;
    parameters: ParameterObject[] | ReferenceObject[];
    requestBody: RequestBodyObject | ReferenceObject;
    responses: ResponsesObject;
}

interface ReferenceObject {
    $ref: string;
}

interface ParameterObject {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    description?: string;
    required: boolean;
    allowEmptyValue: boolean;
}

interface PathItemObject {
    $ref: string;
    summary: string;
    description?: string;
    get?: OperationObject;
    put?: OperationObject;
    post?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    patch?: OperationObject;
    trace?: OperationObject;
    servers?: ServerObject[];
    parameters?: ParameterObject[] | ReferenceObject[];
}

interface PathsObject {
   [key: string]: PathItemObject;
}

export interface Template {
    openapi: string;
    info: InfoObject;
    servers: ServerObject[];
    paths: PathsObject;
}
