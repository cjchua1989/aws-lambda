import { TAGS_NAMES } from '../config';
import { METHODS } from '../default';

const key = 'user';
const method = METHODS.get;
const tag = TAGS_NAMES.RESOURCES;
const summary = 'Get user details';
const parameters = {};
const responses = {
    409: {
        description: `User doesn't exist`,
        schema: 'Response422',
        example: {
            code: 409,
            message: `User doesn't exist`,
        },
    },
    200: {
        description: 'Return user records',
        schema: 'ViewResponse',
        example: {
            code: 200,
            message: 'Successfully user found',
            data: {
                id: '4eeeca80-568a-4cce-8d55-1d0af4e5e7ef',
                name: 'Rusty',
                email: 'Rory32@gmail.com',
                mobile: '09179509311',
                email_verified_at: '2021-05-24 11:48:05',
                mobile_verified_at: '2021-05-24 11:48:05',
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
