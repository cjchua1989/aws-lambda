export interface S3Object {
    bucket: {
        name: string;
    };
    object: {
        key: string;
    };
}

export interface S3EventRecord {
    eventVersion: string;
    eventSource: string;
    awsRegion: string;
    eventTime: string;
    eventName: string;
    s3: S3Object;
}

export interface S3Event {
    Records: S3EventRecord[];
}
