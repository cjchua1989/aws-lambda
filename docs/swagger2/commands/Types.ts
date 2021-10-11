export interface Attribute {
    type: 'integer' | 'number' | 'string' | 'boolean' | 'object' | 'array';
    properties?: Structure;
    items?: Structure;
    description: string;
}

export interface Structure {
    [key: string]: Attribute;
}

export class Types {
    static INTEGER(description = ''): Attribute {
        return {
            type: 'integer',
            description,
        };
    }

    static NUMBER(description=''): Attribute {
        return {
            type: 'number',
            description,
        };
    }

    static STRING(description = ''): Attribute {
        return {
            type: 'string',
            description,
        };
    }

    static BOOLEAN(description = ''): Attribute {
        return {
            type: 'boolean',
            description,
        };
    }

    static OBJECT(properties: Structure, description = ''): Attribute {
        return {
            type: 'object',
            properties,
            description,
        };
    }

    static ARRAY(items: Structure, description = ''): Attribute {
        return {
            type: 'array',
            items,
            description,
        };
    }
}
