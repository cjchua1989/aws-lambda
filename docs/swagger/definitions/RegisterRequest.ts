import { TYPES } from '../default';

module.exports.default = {
    RegisterRequest: {
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
            description: 'Mobile number of the user (Format: 09XXXXXXXXX)',
        },
        password: {
            type: TYPES.string,
            description: 'Password of the user',
        },
    },
};
