import { TYPES } from '../default';

module.exports.default = {
    AuthRequest: {
        username: {
            type: TYPES.string,
            description: "User's email address or mobile number",
        },
        password: {
            type: TYPES.string,
            description: 'Account password',
        },
    },
};
