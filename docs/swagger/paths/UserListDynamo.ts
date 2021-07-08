import { TAGS_NAMES } from '../config';
import { METHODS } from '../default';
import { LANGUAGE } from '../language';

const key = 'user/dynamo';
const method = METHODS.get;
const tag = TAGS_NAMES.RESOURCES;
const summary = 'List of users with pagination using dynamodb db';
const parameters = {
    query: [
        {
            name: 'page',
            description: 'Hint for the request if NEXT/PREV page',
            example: 'NEXT',
            default: 'NEXT',
            required: true,
        },
        {
            name: 'limit',
            description: 'The numbers of items to return',
            example: 100,
            default: 20,
            required: true,
        },
        {
            name: 'key',
            description:
                "Reference key used for the next/previous page, that will come from the response, use '' as default value for the first request",
            example: '{"lookup_key":"USER","reference_key":"USER:94af7e16-d3c2-4295-9d62-019a0d29f32e"}',
            default: '',
            required: true,
        },
        {
            name: 'forward',
            description:
                'Forward value used for the next/previous page, that will come from the response, use true as default value for the first request',
            example: true,
            default: true,
            required: true,
        },
    ],
};
const responses = {
    200: {
        description: 'User list',
        schema: 'UserListDynamoResponse',
        example: {
            code: 200,
            message: 'User list',
            pagination: {
                limit: 2,
                key: '{"lookup_key":"USER","reference_key":"USER:94af7e16-d3c2-4295-9d62-019a0d29f32e"}',
                forward: true,
            },
            data: [
                {
                    id: '7d9b4095-0858-408c-910b-21911231fd22',
                    name: 'Greg',
                    email: 'Geo_Schmeler63@hotmail.com',
                    mobile: '09785997570',
                },
                {
                    id: '94af7e16-d3c2-4295-9d62-019a0d29f32e',
                    name: 'Camila',
                    email: 'Keaton.Bergstrom69@gmail.com',
                    mobile: '09810020827',
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
