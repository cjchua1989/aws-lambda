interface Headers {
    Authorization?: string;
}

export interface RequestContextContent {
    user_id?: string;
    session_id?: string;
}

interface RequestContext {
    authorizer: RequestContextContent;
}

export interface ApiGatewayEvent {
    headers?: Headers;
    body: string;
    queryStringParameters?: {
        [key: string]: string;
    };
    pathParameters?: {
        [key: string]: string;
    };
    requestContext?: RequestContext;
}
