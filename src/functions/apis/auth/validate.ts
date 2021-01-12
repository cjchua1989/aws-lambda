import { Validation } from '../../../libs/Validation';
import { joi } from '../../../libs/Joi';
import { AuthRequest } from './requests';

export default (request: AuthRequest): AuthRequest => {
    const schema = joi
        .object({
            username: joi.string().required(),
            password: joi.string().required(),
        })
        .required();

    const validate = new Validation<AuthRequest>(schema);
    return validate.validate(request);
};
