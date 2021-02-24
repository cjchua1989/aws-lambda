import { existsSync, writeFileSync } from 'fs';
import { pascalCase } from 'case-anything';

const content = `
import { <model_name> } from '../models/<model_name>';

export const LOOKUP = '<LOOKUP>';
export const REFKEY = '<REFKEY>';

import { DynamoRepository } from './DynamoRepository';
export class <class_name> extends DynamoRepository<<model_name>> {
}
`;

export class DynamoRepositoryTemplate {
    private readonly className: string;
    private readonly modelName: string;

    constructor(name: string) {
        this.modelName = pascalCase(`${name.trim()}_model`);
        this.className = pascalCase(`${name.trim()}_repository`);
    }

    generate(): void {
        if (existsSync(`./src/repositories/${this.className}.ts`)) throw new Error('Repository already existed');

        writeFileSync(
            `./src/repositories/${this.className}.ts`,
            content
                .trim()
                .replace(/<class_name>/g, this.className)
                .replace(/<model_name>/g, this.modelName),
        );
    }
}
