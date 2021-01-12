import * as AWS from 'aws-sdk';
import { Logger } from './Logger';

const kms = new AWS.KMS({ region: process.env.REGION });
const ssm = new AWS.SSM({ region: process.env.REGION });

const STAGE = process.env.STAGE;
const KEYS: {
    [key: string]: string;
} = {};

/**
 * Decrypt the KMS encrypted value
 *
 * @param encrypted
 * @param index
 * @returns {Promise<string|*>}
 */
export async function decrypt(encrypted: string, index: string | null = null): Promise<string> {
    if (index && KEYS[index]) return KEYS[index];

    if (STAGE === 'local') return encrypted;

    const payload = {
        CiphertextBlob: Buffer.from(encrypted, 'base64'),
    };

    try {
        const data = await kms.decrypt(payload).promise();
        const decrypted = data && data.Plaintext ? data.Plaintext.toString('ascii') : '';

        if (index) KEYS[index] = decrypted;

        return decrypted;
    } catch (error) {
        Logger.error('KMS.decrypt', error);
        return encrypted;
    }
}

export async function retrieve(path: string, index: string | null = null, encrypted = true): Promise<string> {
    if (index && KEYS[index]) return KEYS[index];
    if (STAGE === 'local') return path;

    try {
        const data = await ssm
            .getParameter({
                Name: path,
                WithDecryption: encrypted,
            })
            .promise();
        const decrypted = data && data.Parameter && data.Parameter.Value ? data.Parameter.Value : '';
        if (index) KEYS[index] = decrypted;

        return decrypted;
    } catch (error) {
        console.log('Retrieve error:', error);
        return path;
    }
}
