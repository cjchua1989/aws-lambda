import { Readable, Stream } from 'stream';
import { getService } from '../libs/S3';
import * as archiver from 'archiver';
const S3_BUCKET = process.env.S3_BUCKET ?? '';

export type S3DownloadStreamDetails = { stream: Readable; filename: string };
export type S3StoredData = { key: string };

export class StreamArchiver {
    private files;
    private zipFileKey;
    private bucketName;
    constructor(fileList: S3StoredData[], zipFileKey: string) {
        this.files = fileList;
        this.zipFileKey = zipFileKey;
        this.bucketName = S3_BUCKET;
    }

    protected async getDownloadStream(s3: AWS.S3): Promise<S3DownloadStreamDetails[]> {
        return this.files.map((item: S3StoredData) => {
            return {
                stream: s3.getObject({ Bucket: this.bucketName, Key: item.key }).createReadStream(),
                filename: item.key,
            };
        });
    }

    public async zipUpload(): Promise<void> {
        const s3 = await getService();
        const s3FileDwnldStreams = await this.getDownloadStream(s3);
        const streamPassThrough = new Stream.PassThrough();

        const uploadParams = {
            Bucket: this.bucketName,
            Body: streamPassThrough,
            ContentType: 'application/zip',
            Key: this.zipFileKey,
        };
        const s3Upload = s3.upload(uploadParams, (err, data) => {
            if (err) console.error('upload error', err);
            else console.log('Zip upload done', data);
        });
        const archive = archiver('zip', {
            zlib: { level: 0 },
        });
        archive.on('error', (error) => {
            throw new Error(`${error.name} ${error.code} ${error.message} ${error.path}  ${error.stack}`);
        });
        s3Upload.on('httpUploadProgress', (progress) => {
            console.log(progress);
        });

        await new Promise((resolve, reject) => {
            streamPassThrough.on('close', resolve);
            streamPassThrough.on('end', resolve);
            streamPassThrough.on('error', reject);

            archive.pipe(streamPassThrough);
            s3FileDwnldStreams.forEach((s3FileDwnldStream) => {
                archive.append(s3FileDwnldStream.stream, {
                    name: s3FileDwnldStream.filename,
                });
            });
            archive.finalize();
        }).catch((error) => {
            throw new Error(`${error.code} ${error.message} ${error.data}`);
        });
        await s3Upload.promise();
        console.log('Zip Stream Upload: done');
    }
}
