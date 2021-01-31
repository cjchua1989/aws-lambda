import { pascalCase, snakeCase } from 'case-anything';
import { existsSync, writeFileSync } from 'fs';

const content = `
import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { DynamoModel } from './DynamoModel';

export class <class_name> extends DynamoModel {
    @attribute()
    attribute_name: string;
}
`;

export class DynamoModelTemplate {
    private readonly className: string;
    private withRepository: boolean;

    constructor(name: string, withRepository = false) {
        this.className = pascalCase(`${name.trim()}_model`);
        this.withRepository = withRepository;
    }

    generate(): void {
        if (this.withRepository && existsSync(`./src/models/${this.className}.ts`)) return;
        if (existsSync(`./src/models/${this.className}.ts`)) throw new Error('Model already existed');

        writeFileSync(`./src/models/${this.className}.ts`, content.trim().replace(/<class_name>/g, this.className));
    }
}
