interface Headers {
    Authorization?: string;
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
}
