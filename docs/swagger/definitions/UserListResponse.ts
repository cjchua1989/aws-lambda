import { API_STANDARD, TYPES } from '../default';

module.exports.default = {
    UserListResponse: {
        ...API_STANDARD(),
        pagination: {
            type: TYPES.object,
            description: 'Pagination information',
            properties: {
                max_page: {
                    type: TYPES.number,
                    description: 'Maximum number of pages for the pagination',
                },
                current_page: {
                    type: TYPES.number,
                    description: 'Current page for data',
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
