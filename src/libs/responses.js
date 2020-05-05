module.exports.API_200 = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: null,
};

const API_500 = {
    statusCode: 500,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: null,
};

module.exports.THROW_API_ERROR = (error) => {
    console.log('Error');
    console.log({
        error,
    });
    console.log('End Error');

    const code = error.code ? error.code : 500;
    const { message } = error;

    if (code === 422) {
        const { errors } = error;
        return {
            ...API_500,
            statusCode: code,
            body: JSON.stringify({
                code,
                message,
                errors,
            }),
        };
    }

    return {
        ...API_500,
        statusCode: code,
        body: JSON.stringify({
            code,
            message,
        }),
    };
};

module.exports.THROW_ERROR = (error) => {
    console.log('Error');
    console.log({
        error,
    });
    console.log('End Error');

    const code = error.code ? error.code : 500;
    const { message } = error;

    if (code === 422) {
        const { errors } = error;
        return {
            code,
            message,
            errors,
        };
    }

    return {
        code,
        message,
    };
};
