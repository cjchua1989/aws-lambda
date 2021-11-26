import { Types } from '../../commands/Types';

export const AUTH_RESPONSE = Types.OBJECT(
    {
        access_token: Types.STRING('Generated access token valid for 1 hour'),
        refresh_token: Types.STRING('Generated refresh token valid for 30 days'),
    },
    'Authentication Response',
);
