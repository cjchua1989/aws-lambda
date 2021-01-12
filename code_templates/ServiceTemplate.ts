import { existsSync, writeFileSync } from 'fs';
import { pascalCase } from 'case-anything';

const content = `
import { Connection } from 'typeorm';

export class <class_name> {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
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
