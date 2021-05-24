import { Validation } from '../../../libs/Validation';
import { joi } from '../../../libs/Joi';
import { RegisterRequest } from './requests';

export default (request: RegisterRequest): RegisterRequest => {
    const schema = joi
        .object({
            name: joi.string().required(),
            email: joi.string().email().required(),
            mobile: joi
                .string()
                .regex(/^09\d{9}$/)
                .messages({ 'string.pattern.base': `Phone number must have 11 digits (Format: 09XXXXXXXXX).` })
                .required(),
            password: joi.string().required(),
        })
        .required();

    const validate = new Validation<RegisterRequest>(schema);
    return validate.validate(request);
};
