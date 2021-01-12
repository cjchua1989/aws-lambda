import { retrieve } from './Kms';
import axios, { AxiosInstance } from 'axios';
import { Logger } from './Logger';

const GL_APP_ID = process.env.GL_APP_ID ?? '';
const GL_APP_SECRET = process.env.GL_APP_SECRET ?? '';
const GL_PASSPHRASE = process.env.GL_PASSPHRASE ?? '';
const GL_CODE = process.env.GL_CODE ?? '';
const GL_URL = 'https://devapi.globelabs.com.ph';
const GL_SEND_SMS: string = '/smsmessaging/v1/outbound/' + GL_CODE + '/requests';

export class GlobeLabs {
    protected app_id: string;
    protected app_secret: string;
    protected passphase: string;
    protected axios: AxiosInstance;

    constructor(app_id: string, app_secret: string, passphase: string) {
        this.app_id = app_id;
        this.app_secret = app_secret;
        this.passphase = passphase;

        this.axios = axios.create({
            baseURL: GL_URL,
            timeout: 30000,
        });
    }

    static async initialize(): Promise<GlobeLabs> {
        return new GlobeLabs(GL_APP_ID, GL_APP_SECRET, await retrieve(GL_PASSPHRASE, 'GL_PASSPHRASE'));
    }

    async sendSMS(address: string, message: string): Promise<boolean> {
        const params = {
            app_id: this.app_id,
            app_secret: this.app_secret,
        };

        const payload = {
            message,
            address,
            passphrase: this.passphase,
        };

        try {
            const result = await this.axios.post(GL_SEND_SMS, payload, {
                params,
            });
            Logger.info('GlobeLabs.SendSMS.SUCCESS', {
                status: result.status,
                response: result.data,
            });

            return true;
        } catch (error) {
            Logger.info('GlobeLabs.SendSMS.FAILED', {
                error,
            });

            return false;
        }
    }
}
