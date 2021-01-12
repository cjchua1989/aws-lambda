// Node Modules
import { Logger } from './Logger';
import * as AWS from 'aws-sdk';

// Global
import { GetObjectRequest } from 'aws-sdk/clients/s3';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

const S3_REGION = process.env.S3_REGION;
const S3_BUCKET = process.env.S3_BUCKET ?? '';

// FOLDERS
export enum FOLDERS {
    REPORTS = 'reports',
    SOURCE = 'source',
    PROCESSED = 'processed',
}

/**
 * Generate S3 Service
 *
 * @returns {Promise<AWS.S3|*>}
 */
async function getService(
    accessKeyId: string | undefined = undefined,
    secretAccessKey: string | undefined = undefined,
): Promise<AWS.S3> {
    const options: ServiceConfigurationOptions = {
        // apiVersion: '2006-03-01',
        region: S3_REGION,
        signatureVersion: 'v4',
        params: {
            Bucket: S3_BUCKET,
        },
        accessKeyId,
        secretAccessKey,
    };

    return new AWS.S3(options);
}

/**
 * Uplaod file via base64 content
 *
 * @param folder
 * @param filename
 * @param contents
 * @param content_type
 * @returns {Promise<boolean>}
 */
export async function uploadFileBase64(
    folder: FOLDERS,
    filename: string,
    contents: string,
    content_type: string,
): Promise<boolean> {
    const service = await getService();
    const parseContents = Buffer.from(contents.replace(/^data:.+;base64,/, ''), 'base64');

    const params: AWS.S3.PutObjectRequest = <AWS.S3.PutObjectRequest>{
        Key: `${folder}/${filename}`,
        ContentEncoding: 'base64',
        ContentType: content_type,
        Body: parseContents,
    };

    return new Promise((resolve, reject) => {
        service.putObject(params, (error, data) => {
            if (error) {
                Logger.error('S3.uploadFileBase64: Error', { error });

                reject(new Error('Upload failed'));
                return false;
            }

            Logger.error('S3.uploadFileBase64: Success', { data });

            resolve(true);
        });
    });
}

/**
 * Upload file to s3 by content
 *
 * @param folder
 * @param filename
 * @param contents
 * @param content_type
 * @returns {Promise<boolean>}
 */
export async function uploadFile(
    folder: FOLDERS,
    filename: string,
    contents: string,
    content_type: string,
): Promise<boolean> {
    const service = await getService();
    const params: AWS.S3.PutObjectRequest = <AWS.S3.PutObjectRequest>{
        Key: `${folder}/${filename}`,
        ContentType: content_type,
        Body: contents,
    };

    Logger.debug('S3.uploadFile', { params });

    return await new Promise((resolve, reject) => {
        service.putObject(params, (error, data) => {
            if (error) {
                Logger.error('S3.uploadFile: Error', { error });

                reject(new Error('Upload failed'));
                return false;
            }

            Logger.error('S3.uploadFile: Success', { data });

            resolve(true);
        });
    });
}

/**
 * Check if the file exist
 *
 * @param folder
 * @param filename
 * @returns {Promise<boolean>}
 */
export async function fileExist(folder: FOLDERS, filename: string): Promise<boolean> {
    const service = await getService();

    const params: AWS.S3.HeadObjectRequest = <AWS.S3.HeadObjectRequest>{
        Key: `${folder}/${filename}`,
    };

    try {
        await service.headObject(params).promise();
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Generate the signeg url of the s3 file
 *
 * @param folder
 * @param filename
 * @param expires
 * @param accessKeyId
 * @param secretAccessKey
 * @returns {Promise<string|*>}
 */
export async function getSignedUrl(
    folder: FOLDERS,
    filename: string,
    expires: number,
    accessKeyId: string | undefined = undefined,
    secretAccessKey: string | undefined = undefined,
): Promise<string> {
    const service = await getService(accessKeyId, secretAccessKey);

    const params = {
        Key: `${folder}/${filename}`,
        Expires: expires,
    };

    Logger.debug('S3.getSignedUrl', { params });

    try {
        return await service.getSignedUrlPromise('getObject', params);
    } catch (error) {
        return '';
    }
}

export function getUrl(folder: FOLDERS, filename: string): string {
    return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${folder}/${filename}`;
}

export async function getList(folder: FOLDERS, sub_folder: string): Promise<(string | undefined)[]> {
    const service = await getService();

    const params = {
        Bucket: S3_BUCKET,
        Prefix: `${folder}/${sub_folder}`,
    };

    try {
        const result = await service.listObjectsV2(params).promise();
        return result.Contents ? result.Contents.map((item) => item.Key) : [];
    } catch (error) {
        Logger.error('S3.getList', {
            error,
        });

        return [];
    }
}

export async function getContents(
    folder: FOLDERS | undefined,
    filename: string,
    BUCKET: string | undefined = undefined,
): Promise<string> {
    const service = await getService();

    const params: GetObjectRequest = {
        Key: folder ? `${folder}/${filename}` : filename,
        Bucket: BUCKET ?? S3_BUCKET,
    };

    return await new Promise((resolve, reject) => {
        service.getObject(params, (error, data) => {
            // Logger.debug('S3.getContents', { error, data });

            if (error || !data.Body) {
                reject({
                    code: 500,
                    message: 'Import Failed',
                });
                return;
            }

            resolve(data.Body.toString('utf8'));
        });
    });
}

/**
 * Delete object on S3
 *
 * @param folder
 * @param filename
 */
export async function deleteFile(folder: FOLDERS, filename: string): Promise<boolean> {
    const service = await getService();

    const params: AWS.S3.DeleteObjectRequest = {
        Bucket: S3_BUCKET,
        Key: `${folder}/${filename}`,
    };

    return new Promise((resolve, reject) => {
        service.deleteObject(params, (error, data) => {
            if (error) {
                Logger.error('S3.deleteFile: Error', { error });

                reject(new Error('Upload failed'));
                return false;
            }

            Logger.error('S3.deleteFile: Success', { data });

            resolve(true);
        });
    });
}
