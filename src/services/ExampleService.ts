import axios, { AxiosInstance } from 'axios';

export class ExampleService {
    private client: AxiosInstance;

    constructor(secret_key: string) {
        this.client = axios.create({
            baseURL: '<url_of_service>',
            timeout: 30000,
        });
    }
}
