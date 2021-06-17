import { HttpResponse } from './Contracts/HttpResponse';
import { APIHttpResponse } from './Contracts/APIHttpResponse';
import { Logger } from './Logger';
import { EventResponse } from './Contracts/EventResponse';

const API_200 = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: null,
};

const API_500 = {
    statusCode: 500,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: null,
};

export function THROW_API_ERROR(error: HttpResponse): APIHttpResponse {
    Logger.error('APIResponse.Error', { error });

    const code = error.code ? error.code : 500;
    const statusCode = error.statusCode ?? code;
    const { message } = error;

    if (code === 422) {
        const errors = error.errors;
        return {
            ...API_500,
            statusCode,
            body: JSON.stringify({
                code,
                message,
                errors,
            }),
        };
    }

    return {
        ...API_500,
        statusCode,
        body: JSON.stringify({
            code,
            message,
        }),
    };
}

export function API_RESPONSE(data: HttpResponse): APIHttpResponse {
    Logger.info('APIResponse.Success', { data });

    return {
        ...API_200,
        statusCode: data.statusCode ?? 200,
        body: JSON.stringify(data),
    };
}

export function HTML_RESPONSE(html: string, statusCode = 200): APIHttpResponse {
    Logger.info('HTMLResponse.Success', { html });

    return {
        headers: {
            'Content-Type': 'text/html',
        },
        statusCode,
        body: html,
    };
}

export function THROW_ERROR(error: EventResponse): EventResponse {
    Logger.error('Event Response Error', { error });

    const code: number = error.code ? error.code : 500;
    const { message } = error;

    if (code === 422) {
        const { errors } = error;
        return {
            code,
            message,
            errors,
        };
    }

    return {
        code,
        message,
    };
}

export function RESPONSE(response: EventResponse): EventResponse {
    Logger.error('Event Response', { response });
    return response;
}
