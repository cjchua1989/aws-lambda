import * as YAML from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import { Type } from 'yaml/util';

import { OPENAPI, PROJECT_INFO, TAGS, getDefinitions, getPaths, DEFAULTS } from './config';

import { API_STANDARD, RESPONSES, TYPES, addDefinition, addPath } from './default';

async function generate() {
    let definitions = {
        ...DEFAULTS,
    };
    let paths = {};

    for (const index in RESPONSES) {
        if (index === 'Response422') {
            definitions = {
                ...definitions,
                ...addDefinition(index, RESPONSES[index], TYPES.object, {
                    ...API_STANDARD(),
                    errors: {
                        type: TYPES.object,
                        properties: {
                            '<fieldname>': {
                                type: TYPES.string,
                                description: 'Error about the field',
                            },
                        },
                    },
                }),
            };
            continue;
        }

        definitions = {
            ...definitions,
            ...addDefinition(index, RESPONSES[index], TYPES.object, API_STANDARD()),
        };
    }
    const DEFINITIONS = await getDefinitions();
    const PATHS = [...(await getPaths(''))];
    for (const index in DEFINITIONS) {
        definitions = {
            ...definitions,
            ...addDefinition(index, '', TYPES.object, DEFINITIONS[index]),
        };
    }

    for (let i = 0; i < PATHS.length; i += 1) {
        const row = PATHS[i];
        paths = addPath(row.key, row.tag, row.method, row.summary, row.parameters, row.responses, paths);
    }

    YAML.scalarOptions.str.defaultType = Type.QUOTE_DOUBLE;
    const swagger = YAML.stringify(
        {
            openapi: OPENAPI,
            info: PROJECT_INFO,
            tags: TAGS,
            paths,
            components: {
                schemas: definitions,
            },
        },
        {
            simpleKeys: true,
        },
    );

    fs.writeFile(path.join(__dirname, 'swagger.yml'), swagger, function (err) {
        if (err) throw err;
        console.log('Swagger File successfully generated');
    });
}

generate().then();
