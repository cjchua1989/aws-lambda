import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../../src/libs/Logger';

const OPENAPI = '3.0.0';
const PROJECT_INFO = {
    description: '',
    version: '1.0.0',
    title: 'ProjectName',
    contact: {
        email: 'example@example.com',
    },
    license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
};

const TAGS_NAMES = {
    RESOURCES: 'RESOURCES',
};

const TAGS = [
    {
        name: TAGS_NAMES.RESOURCES,
        description: 'APIs Supported',
    },
];

const DEFAULTS = {
    AuthenticationToken: {
        type: 'string',
        description: 'JWT Token to access secured apis',
    },
    RefreshToken: {
        type: 'string',
        description: 'Token to regenerate the AuthenticationToken',
    },
};

const getDefinitions = async (): Promise<any> => {
    let DEFINITIONS = {};

    const files = fs.readdirSync(path.join(__dirname, 'definitions'));

    for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const file_path = `./definitions/${file.replace('.ts', '')}`;
        const data = await import(file_path);

        DEFINITIONS = {
            ...DEFINITIONS,
            ...data.default,
        };
    }

    return DEFINITIONS;
};
const getPaths = async (directory: string): Promise<any[]> => {
    const PATHS: any[] = [];

    try {
        const files = fs.readdirSync(path.join(__dirname, `paths/${directory}`));

        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];
            const file_path = `./paths/${directory}/${file.replace('.ts', '')}`;
            const data = await import(file_path);

            PATHS.push(data.default);
        }

        return PATHS;
    } catch (error) {
        Logger.debug('Config.getPaths', { error });

        return [];
    }
};

export { OPENAPI, PROJECT_INFO, TAGS_NAMES, TAGS, DEFAULTS, getDefinitions, getPaths };
