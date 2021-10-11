import { Generate } from './commands/Generate';
import * as YAML from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

async function process() {
    const generate = new Generate(
        path.join(__dirname, `config.json`),
        path.join(__dirname, `paths`),
        path.join(__dirname, `base_schemas`),
        path.join(__dirname, `schemas`),
    );

    await generate.execute();
    const swagger = YAML.stringify(generate.compile(), {
        simpleKeys: true,
    });

    fs.writeFileSync(path.join(__dirname, 'swagger.yml'), swagger);
}

process().then();
