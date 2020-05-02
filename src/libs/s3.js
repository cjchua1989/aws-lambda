// Node Modules
const AWS = require('aws-sdk');

// Global
const { decrypt } = require('./kms');

const { S3_ACCESS_KEY } = process.env;
const { S3_SECRET_KEY } = process.env;
const { S3_REGION } = process.env;
const { S3_BUCKET } = process.env;
let S3;

// FOLDERS
// module.exports.FOLDER_NAME = "folder/name/to/store/files";

/**
 * Generate S3 Service
 *
 * @returns {Promise<AWS.S3|*>}
 */
async function getService() {
    if (S3) return S3;

    S3 = new AWS.S3({
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: await decrypt(S3_SECRET_KEY, 'S3_SECRET_KEY'),
        region: S3_REGION,
        signatureVersion: 'v4',
        params: {
            Bucket: S3_BUCKET,
            ACL: 'private',
        },
    });

    return S3;
}

/**
 * Uplaod file via base64 content
 *
 * @param folder
 * @param filename
 * @param contents
 * @param contentType
 * @returns {Promise<unknown>}
 */
module.exports.uploadFileBase64 = async (
    folder,
    filename,
    contents,
    contentType
) => {
    const service = await getService();
    const parseContents = Buffer.from(
        contents.replace(/^data:.+;base64,/, ''),
        'base64'
    );

    const params = {
        Key: `${folder}/${filename}`,
        ContentEncoding: 'base64',
        ContentType: contentType,
        Body: parseContents,
    };

    return new Promise((resolve, reject) => {
        service.putObject(params, (error, data) => {
            if (error) {
                console.log('S3UploadBase64 Error');
                console.log({ error });

                reject(new Error('Upload failed'));
                return;
            }

            console.log('S3UploadBase64 Success');
            console.log({ data });

            resolve(true);
        });
    });
};

/**
 * Upload file to s3 by content
 *
 * @param folder
 * @param filename
 * @param contents
 * @param contentType
 * @returns {Promise<unknown>}
 */
module.exports.uploadFile = async (folder, filename, contents, contentType) => {
    const service = await getService();
    const params = {
        Key: `${folder}/${filename}`,
        ContentType: contentType,
        Body: contents,
    };

    return await new Promise((resolve, reject) => {
        service.putObject(params, (error, data) => {
            if (error) {
                console.log(
                    `S3Upload Error: ${util.inspect(error, {
                        showHidden: false,
                        depth: null,
                    })}`
                );
                reject({
                    code: 500,
                    message: 'Upload failed',
                });
                return;
            }

            console.log(
                `S3Upload Success: ${util.inspect(data, {
                    showHidden: false,
                    depth: null,
                })}`
            );
            resolve(true);
        });
    });
};

/**
 * Check if the file exist
 *
 * @param folder
 * @param filename
 * @returns {Promise<boolean>}
 */
module.exports.fileExist = async (folder, filename) => {
    const service = await getService();

    const params = {
        Key: `${folder}/${filename}`,
    };

    try {
        await service.headObject(params).promise();
        return true;
    } catch (error) {
        console.log(
            `S3FileExist Error: ${util.inspect(error, {
                showHidden: false,
                depth: null,
            })}`
        );
        return false;
    }
};

/**
 * Generate the signeg url of the s3 file
 *
 * @param folder
 * @param filename
 * @param expires
 * @returns {Promise<string|*>}
 */
module.exports.getSignedUrl = async (folder, filename, expires) => {
    const service = await getService();

    const params = {
        Key: `${folder}/${filename}`,
        Expires: expires,
    };

    try {
        return await service.getSignedUrlPromise('getObject', params);
    } catch (error) {
        console.log(
            `S3SignedUrl Error: ${util.inspect(error, {
                showHidden: false,
                depth: null,
            })}`
        );
        return '';
    }
};
