interface Headers {
    Authorization?: string;
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
}

export interface Event {
    source?: string;
    methodArn: string;
    authorizationToken: string;
}
