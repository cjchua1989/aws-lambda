class ParameterError extends Error {
    constructor(errors) {
        super('Parameter error: Please provide required parameter');

        this.code = 422;
        this.errors = {};

        for (let i; i < errors.length(); i += 1) {
            const error = errors[i];
            this.errors[error.path] = error.message;
        }
    }
}

module.exports = {
    ParameterError,
};