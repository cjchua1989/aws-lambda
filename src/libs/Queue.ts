import { SQS } from 'aws-sdk';
import { HttpRequest } from './Contracts/HttpRequest';
const sqs = new SQS({ apiVersion: '2012-11-05' });

export interface QueueMessage {
    queue_id: string;
    message: HttpRequest;
}

export class Queue {
    static async sendMessages(QueueUrl: string, messages: QueueMessage[], MessageGroupId: string): Promise<void> {
        const Entries: SQS.SendMessageBatchRequestEntryList = [];
        const DelaySeconds = 0;

        for (let i = 0; i < messages.length; i += 1) {
            const Id = messages[i].queue_id;
            const MessageBody = JSON.stringify(messages[i].message);

            Entries.push({
                Id,
                MessageBody,
                DelaySeconds,
                MessageGroupId,
            });
        }

        const params: SQS.SendMessageBatchRequest = {
            Entries,
            QueueUrl,
        };

        await sqs.sendMessageBatch(params).promise();
    }
}
