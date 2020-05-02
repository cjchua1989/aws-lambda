'use strict';

const LAMBDA_URL = process.env.LAMBDA_URL;
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
module.exports.invokeEvent = async(FunctionName, Payload = {}) => {
    let result = await LAMBDA.invoke({
        FunctionName: `${LAMBDA_URL}-${FunctionName}`,
        InvocationType: 'Event',
        Payload: JSON.stringify(Payload)
    }).promise();

    return result;
};

/**
 * Invoke the lambda function with response
 *
 * @param FunctionName
 * @param Payload
 * @returns {Promise<any>}
 */
module.exports.invokeWithResponse = async(FunctionName, Payload) => {

    let result = await LAMBDA.invoke({
        FunctionName: `${LAMBDA_URL}-${FunctionName}`,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(Payload)
    }).promise();

    return JSON.parse(result.Payload);
};
