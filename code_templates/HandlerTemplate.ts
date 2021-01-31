import { pascalCase, snakeCase } from 'case-anything';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Handler } from './handlers/Handler';
import { ApiHandler } from './handlers/ApiHandler';
import { CronHandler } from './handlers/CronHandler';
import { EventHandler } from './handlers/EventHandler';

export enum Type {
    API = 'apis',
    EVENT = 'events',
    CRON = 'crons',
}

export class HandlerTemplate {
    private readonly name: string;
    private readonly type: Type;
    private readonly request_name: string;
    private readonly action_name: string;
    private template: Handler;

    constructor(name: string, type: Type) {
        this.name = snakeCase(name.trim());
        this.type = type;
        this.request_name = pascalCase(`${name.trim()}_request`);
        this.action_name = pascalCase(`${name.trim()}_action`);

        switch (type) {
            case Type.API:
                this.template = new ApiHandler();
                break;
            case Type.CRON:
                this.template = new CronHandler();
                break;
            case Type.EVENT:
                this.template = new EventHandler();
                break;
        }
    }

    generate(): void {
        if (existsSync(`./src/functions/${this.type}/${this.name}`)) {
            switch (this.type) {
                case Type.EVENT:
                    throw new Error('Event handler already existed');
                case Type.CRON:
                    throw new Error('Cron handler already existed');
                case Type.API:
                    throw new Error('API handler already existed');
            }
        }

        mkdirSync(`./src/functions/${this.type}/${this.name}`);
        writeFileSync(
            `./src/functions/${this.type}/${this.name}/config.yml`,
            this.template.config
                .replace(/<name>/g, this.name)
                .replace(/<type>/g, this.type)
                .trim(),
        );
        writeFileSync(
            `./src/functions/${this.type}/${this.name}/handler.ts`,
            this.template.handler
                .replace(/<request_name>/g, this.request_name)
                .trim()
                .replace(/<action_name>/g, this.action_name)
                .trim(),
        );
        writeFileSync(
            `./src/functions/${this.type}/${this.name}/handler_test.ts`,
            this.template.handler_test.replace(/<request_name>/g, this.request_name).trim(),
        );

        writeFileSync(
            `./src/functions/${this.type}/${this.name}/action.ts`,
            this.template.action.replace(/<action_name>/g, this.action_name).trim(),
        );
        writeFileSync(`./src/functions/${this.type}/${this.name}/responses.ts`, this.template.responses.trim());

        if (this.type !== Type.CRON) {
            writeFileSync(
                `./src/functions/${this.type}/${this.name}/requests.ts`,
                this.template.requests.replace(/<request_name>/g, this.request_name).trim(),
            );
            writeFileSync(
                `./src/functions/${this.type}/${this.name}/validate.ts`,
                this.template.validate.replace(/<request_name>/g, this.request_name).trim(),
            );
        }
    }
}
