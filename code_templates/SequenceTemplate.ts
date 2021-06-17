import { pascalCase } from 'case-anything';
import { existsSync, writeFileSync } from 'fs';

const content = `
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: Another authentication Response
@enduml
`;

export class SequenceTemplate {
    private readonly className: string;

    constructor(name: string) {
        this.className = pascalCase(name.trim());
    }

    generate(): void {
        if (existsSync(`./docs/sequence/${this.className}.puml`)) throw new Error('Sequence already existed');
        writeFileSync(
            `./docs/sequence/${this.className}.puml`,
            content.trim().replace(/<class_name>/g, this.className),
        );
    }
}
