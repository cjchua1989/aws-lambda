import { TAGS_NAMES } from '../config';
import { METHODS } from '../default';

const key = 'delete';
const method = METHODS.delete;
const tag = TAGS_NAMES.RESOURCES;
const summary = 'Soft delete user';
const parameters = {};
const responses = {
    409: {
        description: `User doesn't exist`,
        schema: 'Response422',
        example: {
            code: 422,
            message: `User doesn't exist`,
        },
    },
    200: {
        description: 'Success deleted',
        schema: 'DeleteResponse',
        example: {
            code: 200,
            message: 'User successfully deleted',
            data: {
                user_id: 'd4caf105-adc8-48c0-8b1e-7d5a7b6c2a15',
                name: 'Jillian',
                email: 'Alfred_DAmore@gmail.com',
                mobile: '09970269381',
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
