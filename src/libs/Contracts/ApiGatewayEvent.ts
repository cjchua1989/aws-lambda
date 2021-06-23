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
    source?: string;
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

export interface Event {
    source?: string;
    methodArn: string;
    authorizationToken: string;
}
