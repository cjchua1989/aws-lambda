import { TAGS_NAMES } from '../config';
import { METHODS } from '../default';

const key = 'user';
const method = METHODS.post;
const tag = TAGS_NAMES.RESOURCES;
const summary = 'Register new user';
const parameters = {
    body: {
        schema: 'RegisterRequest',
        example: {
            name: 'Marisol Cantillano',
            email: 'meccantillano@gmail.com',
            mobile: '09759389266',
            password: 'fcki8pg3nxdx4jq6bn',
        },
    },
};
const responses = {
    409: {
        description: 'Email/Mobile already exist',
        schema: 'Response422',
        examples: {
            EMAIL_EXIST: {
                description: 'Email exists',
                value: {
                    code: 409,
                    message: 'Email already exist',
                },
            },
            MOBILE_EXIST: {
                description: 'Mobile exists',
                value: {
                    code: 409,
                    message: 'Mobile already exist',
                },
            },
        },
    },
    422: {
        description: 'Parameter Error',
        schema: 'Response422',
        example: {
            code: 422,
            message: 'Parameter error: Please provide required parameter',
            errors: {
                name: 'name is required',
                email: 'email is required',
                mobile: 'mobile is required',
                password: 'password is required',
            },
        },
    },
    200: {
        description: 'Success Registration',
        schema: 'RegisterResponse',
        example: {
            code: 200,
            message: 'Registration successful',
            data: {
                user_id: 'eef38349-02c3-4bdd-b100-52fc44ed8333',
                name: 'Jerwyn Rabor',
                email: 'example@exampl1e.com',
                mobile: '09123456782',
            },
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
