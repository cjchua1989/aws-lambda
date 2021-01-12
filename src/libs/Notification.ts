import { SNS } from 'aws-sdk';
import { Logger } from './Logger';

const sns = new SNS({ apiVersion: '2010-03-31', region: process.env.REGION });

export class Notification {
    static async publish<M>(
        TopicArn: string,
        Message: M,
        MessageAttributes: SNS.MessageAttributeMap = {},
    ): Promise<void> {
        const params: SNS.PublishInput = {
            TopicArn,
            Message: JSON.stringify(Message),
            MessageAttributes,
        };

        Logger.info('Notification.publish', params);
        const response = await sns.publish(params).promise();
        Logger.info('Notification.publish', { response });
    }

    static async email(TopicArn: string, Subject: string, Message: string): Promise<void> {
        const params: SNS.PublishInput = {
            TopicArn,
            Message,
            Subject,
        };

        Logger.info('Notification.email', params);
        const response = await sns.publish(params).promise();
        Logger.info('Notification.email', { response });
    }
}
