import { Generate } from './commands/Generate';
import * as fs from 'fs';
import * as path from 'path';
import * as validator from 'ibm-openapi-validator';
import { Logger } from '../../src/libs/Logger';

async function process() {
    const generate = new Generate(
        path.join(__dirname, `config.json`),
        path.join(__dirname, `paths`),
        path.join(__dirname, `base_schemas`),
        path.join(__dirname, `schemas`),
    );

    await generate.execute();
    const swagger = JSON.stringify(generate.compile(), null, '\t');
    fs.writeFileSync(path.join(__dirname, 'swagger.json'), swagger);
    const checks = await validator(path.join(__dirname, 'swagger.json'), false);
    Logger.debug('API Documentation test result', checks);
}

process().then();
