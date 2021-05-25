import { API_STANDARD, TYPES } from '../default';

module.exports.default = {
    DeleteResponse: {
        ...API_STANDARD(),
        key: {
            type: TYPES.string,
            description: 'Deleted data of the user',
            properties: {
                id: {
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
                email_verified_at: {
                    type: TYPES.string,
                    description: 'Email verification date of the user',
                },
                mobile_verified_at: {
                    type: TYPES.string,
                    description: 'Mobile verification date of the user',
                },
            },
        },
    },
};
