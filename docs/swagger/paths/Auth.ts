import { TAGS_NAMES } from '../config';
import { METHODS } from '../default';
import { LANGUAGE } from '../language';

const key = 'auth';
const method = METHODS.post;
const tag = TAGS_NAMES.RESOURCES;
const summary = 'Validate the username and password provided on the database';
const parameters = {
    body: {
        schema: 'AuthRequest',
        example: {
            username: 'example@example.com',
            password: 'password',
        },
    },
};
const responses = {
    422: {
        description: LANGUAGE.RESPONSES.DEFAULT['422'],
        schema: 'Response422',
        example: {
            code: 422,
            message: 'Parameter error: Please provide required parameter',
            errors: {
                username: 'Username is required',
                password: 'Password is required',
            },
        },
    },
    401: {
        description: LANGUAGE.RESPONSES.DEFAULT['401'],
        schema: 'Response401',
        example: {
            code: 401,
            message: 'Invalid username and password',
        },
    },
    423: {
        description: LANGUAGE.RESPONSES.DEFAULT['423'],
        schema: 'Response423',
        example: {
            code: 423,
            message: 'Max login reached please try again after minutes',
        },
    },
    200: {
        description: 'Successful Login',
        schema: 'AuthResponse',
        example: {
            code: 200,
            message: 'Login successful',
            user: {
                name: 'Juan dela Cruz',
                email: 'example@example.com',
                mobile: '09123456789',
            },
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        },
    },
};

module.exports.default = {
    key,
    method,
    tag,
    summary,
    parameters,
    responses,
};
