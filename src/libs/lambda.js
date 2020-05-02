const { LAMBDA_URL } = process.env;
const AWS = require('aws-sdk');

const LAMBDA = new AWS.Lambda();

// EVENTS
// module.exports.FUNCTION_NAME = 'function_name';

/**
 * Invoke the lambda function without response
 *
 * @param FunctionName
 * @param Payload
 * @returns {Promise<any>}
 */
module.exports.invokeEvent = async (FunctionName, Payload = {}) => {
    return LAMBDA.invoke({
        FunctionName: `${LAMBDA_URL}-${FunctionName}`,
        InvocationType: 'Event',
        Payload: JSON.stringify(Payload),
    }).promise();
};

/**
 * Invoke the lambda function with response
 *
 * @param FunctionName
 * @param Parameter
 * @returns {Promise<any>}
 */
module.exports.invokeWithResponse = async (FunctionName, Parameter) => {
    const result = await LAMBDA.invoke({
        FunctionName: `${LAMBDA_URL}-${FunctionName}`,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(Parameter),
    }).promise();

    return JSON.parse(result.Payload);
};
