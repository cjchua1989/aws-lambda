import { SNS } from 'aws-sdk';

export interface QueueEventRecord {
    messageId: string;
    receiptHandle: string;
    body: string;
    attributes: {
        [key: string]: string;
    };
    messageAttributes: SNS.MessageAttributeMap;
    md5OfMessageAttributes: string;
    md5OfBody: string;
    eventSource: string;
    eventSourceARN: string;
    awsRegion: string;
}

export interface QueueEvent {
    Records: QueueEventRecord[];
}
