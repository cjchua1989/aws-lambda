import * as AWS from 'aws-sdk';
import { Logger } from './Logger';
import * as Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

export class Email {
    static async send(
        sender: string,
        subject: string,
        text: string,
        html: string,
        receiver: string[],
    ): Promise<boolean> {
        const params = {
            Destination: {
                ToAddresses: receiver,
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: html,
                    },
                    Text: {
                        Charset: 'UTF-8',
                        Data: text,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject,
                },
            },
            Source: sender,
        };

        const email = new AWS.SES({
            apiVersion: '2010-12-01',
            region: 'us-east-1',
        });

        try {
            const response = await email.sendEmail(params).promise();
            Logger.info('Email.send.SUCCESS', { response });

            return true;
        } catch (error) {
            Logger.error('Email.send.ERROR', { error });
            return false;
        }
    }

    static async sendWithAttachment(
        sender: string,
        subject: string,
        text: string,
        html: string,
        receiver: string[],
        attachments: Mail.Attachment[],
    ): Promise<void> {
        const email = nodemailer.createTransport({
            SES: new AWS.SES({
                apiVersion: '2010-12-01',
                region: 'us-east-1',
            }),
        });

        try {
            const response = await email.sendMail({
                from: sender,
                to: receiver,
                subject,
                text,
                html,
                attachments,
            });

            Logger.info('Email.sendWithAttachment.SUCCESS', { response });
        } catch (error) {
            Logger.error('Email.sendWithAttachment.ERROR', { error });
        }
    }
}
