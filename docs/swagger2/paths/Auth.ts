import { HttpStatus, Method, Path } from '../commands/Path';
import { AuthRequest, AuthResponse } from '../helpers/Auth/contract';
import { Generator } from '../helpers/Auth/generator';
import { SingleData } from '../helpers/General';

const METHOD = Method.POST;
const PATH = 'auth';
const TAG = 'PUBLIC';
const DESCRIPTION = 'Generate access token to access the apis';

type Response = SingleData<AuthResponse>;

export class Auth extends Path {
    constructor() {
        super(METHOD, PATH, TAG, DESCRIPTION);

        this.addBody<AuthRequest>(Generator.request());
        this.addResponse<Response>(HttpStatus.SUCCESS, 'Token successfully generated', {
            data: Generator.response(),
        });

        this.addParameterError({
            key: 'Key is required',
            secret: 'Secret is required',
        });

        this.addStandardResponse(HttpStatus.UNAUTHORIZED, 'Invalid key and secret provided');
    }
}
