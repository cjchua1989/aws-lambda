export interface Attribute {
    type: 'integer' | 'number' | 'string' | 'boolean' | 'object' | 'array';
    properties?: Structure;
    items?: Attribute;
    description: string;
    enum?: string[] | number[];
    required?: boolean | string[];
}

export interface Structure {
    [key: string]: Attribute;
}

export class Types {
    static INTEGER(description = '', enumerate?: number[], required = true): Attribute {
        const attribute: Attribute = {
            type: 'integer',
            description,
            required,
        };

        if (enumerate) attribute.enum = enumerate;
        return attribute;
    }

    static NUMBER(description = '', enumerate?: number[], required = true): Attribute {
        const attribute: Attribute = {
            type: 'number',
            description,
            required,
        };

        if (enumerate) attribute.enum = enumerate;
        return attribute;
    }

    static STRING(description = '', enumerate?: string[], required = true): Attribute {
        const attribute: Attribute = {
            type: 'string',
            description,
            required,
        };

        if (enumerate) attribute.enum = enumerate;
        return attribute;
    }

    static BOOLEAN(description = '', required = true): Attribute {
        return {
            type: 'boolean',
            description,
            required,
        };
    }

    static OBJECT(properties: Structure, description = '', calculate_required = false): Attribute {
        const required: string[] = [];
        for (const index in properties) {
            const item = properties[index];
            if (item.required === true) {
                required.push(index);
            }
            delete item.required;
        }

        return {
            type: 'object',
            properties,
            description,
            required: required.length > 0 && calculate_required ? required : undefined,
        };
    }

    static ARRAY(items: Attribute, description = '', required = true): Attribute {
        if (typeof items.required === 'boolean') delete items.required;
        return {
            type: 'array',
            items,
            description,
            required,
        };
    }
}
