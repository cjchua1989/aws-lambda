import predis = require('predis');

const REDIS_DB_PORT = process.env.REDIS_DB_PORT ?? '6379';
const REDIS_DB_HOST = process.env.REDIS_DB_HOST ?? '127.0.0.1';
const TTL = process.env.REDIS_TTL ?? 3600;

export class Predis {
    protected client: any;

    constructor() {
        this.client = predis.createClient({
            port: REDIS_DB_PORT,
            server: REDIS_DB_HOST,
        });
    }

    public async get(keys: string) {
        return this.client.get(keys);
    }

    public async setex(keys: any, ttl = TTL, data: any) {
        return await this.client.setex(keys, ttl, data);
    }
}
