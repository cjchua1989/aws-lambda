import { lstatSync, readdirSync, readFileSync } from 'fs';
import { Logger } from '../../../src/libs/Logger';
import { Path } from './Path';
import { Schema } from './Schema';

enum Environment {
    PRODUCTION = 'Production Server',
    DEVELOPMENT = 'Development Server',
    STAGING = 'Staging Server',
}

interface IServer {
    url: string;
    description: string;
    variables: {
        [key: string]: {
            default: string;
        };
    };
}

interface Tag {
    name: string;
    description: string;
}

interface IContact {
    name: string;
    email: string;
}

interface IConfig {
    name: string;
    description?: string;
    version: string;

    staging: string;
    development: string;
    production: string;

    contact?: IContact;

    tags: Tag[];
    security_schemes: ISecuritySchemes;
}

interface IInfo {
    title: string;
    description: string;
    version: string;
    contact?: IContact;
}

interface IInformation {
    openapi: string;
    info: IInfo;
    servers: IServer[];
    compile();
}

interface ICompileInformation {
    openapi: string;
    info: IInfo;
    servers: IServer[];
    tags: Tag[];
}

interface ISecuritySchemes {
    [key: string]: {
        type: 'http';
        scheme: 'bearer';
        bearerFormat: 'JWT';
    };
}

class Information implements IInformation {
    private _description: string;
    private _openapi: string;
    private _servers: IServer[] = [];
    private _title: string;
    private _version: string;
    private _tags: Tag[];
    private _contact?: IContact;
    private _security_schemes?: ISecuritySchemes;

    loadData(file): Information {
        const content = readFileSync(file);
        const data = <IConfig>JSON.parse(content.toString());

        this._openapi = '3.0.1';
        this._title = data.name;
        this._version = data.version;
        this._description = data.description ?? '';
        this._tags = data.tags;
        this._contact = data.contact;
        this._security_schemes = data.security_schemes;

        if (data.development) this.addServer(Environment.DEVELOPMENT, data.development);
        if (data.staging) this.addServer(Environment.STAGING, data.staging);
        if (data.production) this.addServer(Environment.PRODUCTION, data.production);

        return this;
    }

    get openapi(): string {
        return this._openapi;
    }

    get info(): IInfo {
        return {
            title: this._title,
            version: this._version,
            description: this._description,
            contact: this._contact,
        };
    }

    get servers(): IServer[] {
        return this._servers;
    }

    addServer(environment: Environment, url: string) {
        this._servers.push({
            url,
            description: environment,
            variables: {
                key: {
                    default: '',
                },
                secret: {
                    default: '',
                },
            },
        });
    }

    compile(): ICompileInformation {
        return {
            openapi: this.openapi,
            info: this.info,
            servers: this.servers,
            tags: this._tags,
        };
    }

    get security(): ISecuritySchemes | undefined {
        return this._security_schemes;
    }
}

export class Generate {
    private readonly config: string;
    private readonly paths: string;
    private readonly base_schemas: string;
    private readonly schemas: string;
    private output: any;

    constructor(config: string, paths: string, base_schemas: string, schemas: string) {
        this.config = config;
        this.paths = paths;
        this.schemas = schemas;
        this.base_schemas = base_schemas;
    }

    async execute(): Promise<void> {
        try {
            const information = new Information().loadData(this.config);
            this.output = information.compile();

            const paths = await this.loadPaths(this.paths);

            if (paths.length > 0) {
                this.output.paths = {};
                for (const item of paths) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const path: Path = new item();
                    const index = path.index;

                    if (!this.output.paths[index]) this.output.paths[index] = {};
                    this.output.paths[index][path.method] = path.compile;
                }
            }

            this.output.components = { schemas: {} };
            if (information.security) {
                this.output.components.securitySchemes = information.security;
            }
            const base_schemas = await this.loadSchema(this.base_schemas);
            if (base_schemas.length > 0) {
                for (const item of base_schemas) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const schema: Schema = new item();
                    const index = schema.index;

                    this.output.components.schemas[index] = schema.compile;
                }
            }

            const schemas = await this.loadSchema(this.schemas);
            if (schemas.length > 0) {
                for (const item of schemas) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const schema: Schema = new item();
                    const index = schema.index;

                    this.output.components.schemas[index] = schema.compile;
                }
            }
        } catch (error) {
            Logger.error('Generation.ERROR', error);
        }
    }

    async loadPaths(directory: string): Promise<Path[]> {
        let paths: Path[] = [];
        const files = readdirSync(directory);
        for (const file of files) {
            const location = `${directory}/${file}`;
            if (lstatSync(location).isDirectory()) {
                const sub_directory = await this.loadPaths(location);
                paths = [...paths, ...sub_directory];
                continue;
            }

            const data: Path = await import(location);
            for (const index in data) {
                paths.push(data[index]);
            }
        }

        return paths;
    }

    async loadSchema(directory: string): Promise<Schema[]> {
        let schemas: Schema[] = [];
        const files = readdirSync(directory);

        for (const file of files) {
            const location = `${directory}/${file}`;
            if (lstatSync(location).isDirectory()) {
                const sub_directory = await this.loadSchema(location);
                schemas = [...schemas, ...sub_directory];
                continue;
            }

            const data: Schema = await import(location);
            for (const index in data) {
                schemas.push(data[index]);
            }
        }

        return schemas;
    }

    compile(): any {
        return this.output;
    }
}
