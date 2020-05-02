const AWS = require('aws-sdk');

const kms = new AWS.KMS({ region: process.env.REGION });
const { STAGE } = process.env;
const KEYS = {};

/**
 * Decrypt the KMS encrypted value
 *
 * @param encrypted
 * @param index
 * @returns {Promise<string|*>}
 */
module.exports.decrypt = async (encrypted, index = null) => {
    if (index && KEYS[index]) {
        return KEYS[index];
    }

    if (STAGE === 'local') return encrypted;
    const payload = {
        CiphertextBlob: Buffer.from(encrypted, 'base64'),
    };

    try {
        const data = await kms.decrypt(payload).promise();
        const decrypt = data.Plaintext.toString('ascii');

        if (index) KEYS[index] = decrypt;

        return decrypt;
    } catch (error) {
        console.log('Decrypt error:', error);
        return encrypted;
    }
};
