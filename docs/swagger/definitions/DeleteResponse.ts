import { API_STANDARD, TYPES } from '../default';

module.exports.default = {
    DeleteResponse: {
        ...API_STANDARD(),
        key: {
            type: TYPES.string,
            description: 'Deleted data of the user',
            properties: {
                user_id: {
                    type: TYPES.string,
                    description: 'User id of the user',
                },
                name: {
                    type: TYPES.string,
                    description: 'Name of the user',
                },
                email: {
                    type: TYPES.string,
                    description: 'Email of the user',
                },
                mobile: {
                    type: TYPES.string,
                    description: 'Mobile number of the user',
                },
            },
        },
    },
};
