import { existsSync, writeFileSync } from 'fs';
import { pascalCase } from 'case-anything';

const content = `
import axios, { AxiosInstance } from 'axios';

export class <class_name> {
    private client: AxiosInstance;

    constructor(secret_key: string) {
        this.client = axios.create({
            baseURL: '<url_of_service>',
            timeout: 30000,
        });
    }
}
`;

export class ServiceTemplate {
    private readonly className: string;

    constructor(name: string) {
        this.className = pascalCase(`${name.trim()}_service`);
    }

    generate(): void {
        if (existsSync(`./src/services/${this.className}.ts`)) throw new Error('Service already existed');

        writeFileSync(`./src/services/${this.className}.ts`, content.trim().replace(/<class_name>/g, this.className));
    }
}
