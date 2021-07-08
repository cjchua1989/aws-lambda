import { API_STANDARD, TYPES } from '../default';

module.exports.default = {
    UserListDynamoResponse: {
        ...API_STANDARD(),
        pagination: {
            type: TYPES.object,
            description: 'Pagination information',
            properties: {
                limit: {
                    type: TYPES.number,
                    description: 'Maximum number records to be retreived',
                },
                key: {
                    type: TYPES.string,
                    description: 'Key that will be used for the NEXT/PREV request',
                },
                forward: {
                    type: TYPES.boolean,
                    description: 'Forward value that will be used for the NEXT/PREV request',
                },
            },
        },
        data: {
            type: TYPES.array,
            description: 'User list for current page',
            items: {
                type: TYPES.object,
                description: 'Category Information',
                properties: {
                    id: {
                        type: TYPES.number,
                        description: 'User Id',
                    },
                    name: {
                        type: TYPES.string,
                        description: 'User name',
                    },
                    email: {
                        type: TYPES.string,
                        description: 'User email',
                    },
                    mobile: {
                        type: TYPES.string,
                        description: 'User mobile',
                    },
                },
            },
        },
    },
};
