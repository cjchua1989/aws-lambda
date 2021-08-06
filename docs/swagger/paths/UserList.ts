import { TAGS_NAMES } from '../config';
import { METHODS } from '../default';
import { LANGUAGE } from '../language';

const key = 'user';
const method = METHODS.get;
const tag = TAGS_NAMES.RESOURCES;
const summary = 'List of users with pagination using Mysql db';
const parameters = {
    query: [
        {
            name: 'page',
            description: 'The number of items to skip before starting to collect the result set',
            example: 1,
            default: 1,
            required: false,
        },
        {
            name: 'limit',
            description: 'The numbers of items to return',
            example: 100,
            default: 20,
            required: false,
        },
    ],
};
const responses = {
    200: {
        description: 'User list',
        schema: 'UserListResponse',
        example: {
            code: 200,
            message: 'User list',
            pagination: {
                max_page: 7,
                current_page: 1,
            },
            data: [
                {
                    id: 38,
                    name: 'Kellie',
                    email: 'Keyshawn.Wiza@hotmail.com',
                    mobile: '09944528019',
                },
                {
                    id: 37,
                    name: 'Hilma',
                    email: 'Roxanne12@hotmail.com',
                    mobile: '09388304559',
                },
                {
                    id: 36,
                    name: 'Jason',
                    email: 'Jonatan7@yahoo.com',
                    mobile: '09276568962',
                },
            ],
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
