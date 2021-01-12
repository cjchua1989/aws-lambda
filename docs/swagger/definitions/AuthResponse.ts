import { API_STANDARD, TYPES } from '../default';

module.exports.default = {
    AuthResponse: {
        ...API_STANDARD(),
        user: {
            type: TYPES.object,
            description: 'User information',
            properties: {
                name: {
                    type: TYPES.string,
                    description: "User's full name",
                },
                email: {
                    type: TYPES.string,
                    description: "User's email address",
                },
                mobile: {
                    type: TYPES.string,
                    description: "User's mobile number",
                },
            },
        },
        token: {
            type: TYPES.string,
            description: 'Access token of the user',
        },
    },
};
