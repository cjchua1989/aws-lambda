import { pascalCase } from 'case-anything';
import { existsSync, writeFileSync } from 'fs';

const content = `
import { API_STANDARD, TYPES } from '../default';

module.exports.default = {
    <class_name>: {
        ...API_STANDARD(),
        key: {
            type: TYPES.string,
            description: '<description>',
        },
    },
}`;

export class SwaggerResponseTemplate {
    private readonly className: string;

    constructor(name: string) {
        this.className = pascalCase(`${name.trim()}_response`);
    }

    generate(): void {
        if (existsSync(`./docs/swagger/definitions/${this.className}.ts`))
            throw new Error('Swagger Definition already existed');
        writeFileSync(
            `./docs/swagger/definitions/${this.className}.ts`,
            content.trim().replace(/<class_name>/g, this.className),
        );
    }
}
