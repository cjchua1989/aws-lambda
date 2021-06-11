enum TYPES {
    object = 'object',
    string = 'string',
    array = 'array',
    number = 'number',
    boolean = 'boolean',
}

interface API_STANDARD {
    code: {
        type: TYPES;
    };
    message: {
        type: TYPES;
    };
    endpoint: {
        type: TYPES;
    };
}

interface Definitions {
    [key: string]: {
        description: string;
        type: TYPES;
        properties: any;
    };
}

const API_STANDARD = (): API_STANDARD => {
    return {
        endpoint: {
            type: TYPES.string,
        },
        code: {
            type: TYPES.number,
        },
        message: {
            type: TYPES.string,
        },
    };
};

const RESPONSES: {
    [key: string]: string;
} = {
    Response400: 'Bad Request',
    Response401: 'Invalid access details provided',
    Response403: 'Missing access token or account was blocked',
    Response404: 'Entity not found',
    Response409: 'Account already existed',
    Response410: 'OTP Expired',
    Response419: 'Token expired',
    Response422: 'Incomplete parameter provided',
    Response423: 'Max tries reached',
    SuccessResponse: 'Success Response',
};

const addDefinition = (name: string, description: string, type: TYPES, properties: any): any => {
    const data: Definitions = {};
    data[name] = {
        description: description ? description : '',
        type,
        properties,
    };

    return data;
};

enum METHODS {
    post = 'post',
    get = 'get',
    put = 'put',
    delete = 'delete',
}

interface HEADER {
    name: string;
    schema: string;
    description: string;
}

interface BODY {
    name: string;
    schema: string;
    description?: string;
}

interface PATH {
    schema: string;
    description: string;
}

interface PARAMETERS {
    [key: string]: any;
    header?: HEADER;
    body?: BODY;
    path?: PATH;
}

interface RESPONSE {
    description?: string;
    schema: string;
}

interface RESPONSES {
    [index: string]: RESPONSE;
}

enum PARAMETER_TYPES {
    body = 'body',
    header = 'header',
    path = 'path',
    query = 'query',
}

interface PathQuery {
    in: PARAMETER_TYPES;
    name: string;
    schema: {
        type: TYPES;
    };
    required?: boolean;
    description?: string;
    enum?: string[];
    example?: any;
}

interface Path {
    [key: string]: any;
}

const getDefinition = (key: string): string => `#/components/schemas/${key}`;

const addPath = (
    key: string,
    tag: string,
    method: METHODS,
    summary: string,
    parameters: PARAMETERS,
    responses: any,
    paths: any,
): any => {
    const PATH: Path = {};
    PATH[method] = {
        tags: [tag],
        summary,
        responses: {},
    };

    for (const index in parameters) {
        if (!parameters.hasOwnProperty(index)) {
            continue;
        }

        let rows = parameters[index];

        if (!Array.isArray(rows)) {
            rows = [rows];
        }

        for (let i = 0; i < rows.length; i += 1) {
            const row = rows[i];
            switch (index) {
                case PARAMETER_TYPES.body:
                    const content: any = {
                        schema: {
                            $ref: getDefinition(row.schema),
                        },
                    };

                    if (row.example) content.example = row.example;
                    if (row.examples) content.examples = row.examples;

                    PATH[method].requestBody = {
                        required: true,
                        content: {
                            'application/json': content,
                        },
                    };
                    break;
                case PARAMETER_TYPES.header:
                    if (!PATH[method].parameters) PATH[method].parameters = [];
                    PATH[method].parameters.push({
                        in: PARAMETER_TYPES.header,
                        name: row.name,
                        required: row.required ?? false,
                        description: row.description ?? '',
                        example: row.example ?? undefined,
                        schema: {
                            type: TYPES.string,
                        },
                    });
                    break;
                case PARAMETER_TYPES.path:
                    if (!PATH[method].parameters) PATH[method].parameters = [];
                    PATH[method].parameters.push({
                        in: PARAMETER_TYPES.path,
                        name: row.name,
                        schema: {
                            type: TYPES.string,
                        },
                        required: row.required ?? false,
                        description: row.description ?? '',
                        example: row.example ?? undefined,
                    });
                    break;
                case PARAMETER_TYPES.query:
                    if (!PATH[method].parameters) PATH[method].parameters = [];
                    const query: PathQuery = {
                        in: PARAMETER_TYPES.query,
                        name: row.name,
                        required: row.required ?? false,
                        description: row.description ?? '',
                        example: row.example ?? undefined,
                        schema: {
                            type: TYPES.string,
                        },
                    };

                    if (row.enum) query.enum = row.enum;
                    PATH[method].parameters.push(query);
                    break;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    for (const index in responses) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!responses.hasOwnProperty(index)) continue;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { description, schema, example, examples } = responses[index];
        const samples: {
            example?: any;
            examples?: any;
        } = {};

        if (example) samples.example = example;
        if (examples) samples.examples = examples;

        PATH[method].responses[index] = {
            description: description ? description : '',
            content: {
                'application/json': {
                    schema: {
                        $ref: getDefinition(schema),
                    },
                    ...samples,
                },
            },
        };
    }

    if (!paths[`/${key}`]) paths[`/${key}`] = {};

    paths[`/${key}`] = {
        ...paths[`/${key}`],
        ...PATH,
    };

    return paths;
};

export { TYPES, API_STANDARD, RESPONSES, addDefinition, METHODS, PARAMETER_TYPES, getDefinition, addPath };
