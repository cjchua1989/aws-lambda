import { pascalCase, snakeCase } from 'case-anything';
import { existsSync, writeFileSync } from 'fs';
import * as pluralize from 'pluralize';

const content = `
import { Model } from './Model';
import { Column, Entity } from 'typeorm';

@Entity({
    name: '<table_name>',
})
export class <class_name> extends Model {
}
`;

export class ModelTemplate {
    private readonly className: string;
    private readonly tableName: string;
    private withRepository: boolean;

    constructor(name: string, withRepository = false) {
        this.className = pascalCase(`${name.trim()}_model`);
        this.tableName = snakeCase(pluralize(name.trim()));
        this.withRepository = withRepository;
    }

    generate(): void {
        if (this.withRepository && existsSync(`./src/models/${this.className}.ts`)) return;
        if (existsSync(`./src/models/${this.className}.ts`)) throw new Error('Model already existed');

        writeFileSync(
            `./src/models/${this.className}.ts`,
            content
                .trim()
                .replace(/<class_name>/g, this.className)
                .replace(/<table_name>/g, this.tableName),
        );
    }
}
