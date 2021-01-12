import { existsSync, writeFileSync } from 'fs';
import { pascalCase } from 'case-anything';

const content = `
import { EntityRepository, Repository } from 'typeorm';
import { <model_name> } from '../models/<model_name>';

@EntityRepository(<model_name>)
export class <class_name> extends Repository<<model_name>> {
}
`;

export class RepositoryTemplate {
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
