import { Validation } from '../../../libs/Validation';
import { joi } from '../../../libs/Joi';
import { ViewRequest } from './requests';

export default (request: ViewRequest): ViewRequest => {
    const schema = joi
        .object({
            id: joi.string().required(),
        })
        .required();

    const validate = new Validation<ViewRequest>(schema);
    return validate.validate(request);
};
