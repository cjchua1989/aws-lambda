enum Type {
    object = 'object',
    string = 'string',
    array = 'array',
    number = 'number',
    boolean = 'boolean',
}

interface Field {
    name: string;
    type: Type;
    description?: string;
    properties?: ISchema;
    items?: BaseField;
}

interface ISchema {
    [key: string]: BaseField | ObjectField | ItemField;
}

interface BaseField {
    type: Type;
    description?: string;
}

interface ObjectField extends BaseField {
    properties: ISchema;
}

interface ItemField extends BaseField {
    items: BaseField | ObjectField | ItemField;
}

export abstract class Schema {
    private fields: Field[];

    protected addBoolean(name: string, description?: string): void {
        this.addField(name, Type.boolean, description);
    }

    protected addNumber(name: string, description?: string): void {
        this.addField(name, Type.number, description);
    }

    protected addString(name: string, description?: string): void {
        this.addField(name, Type.string, description);
    }

    protected addObject(name: string, properties: Schema, description?: string): void {
        this.addField(name, Type.object, description, properties.generate());
    }

    protected addArray(name: string, items: BaseField | ItemField | ObjectField, description?: string): void {
        this.addField(name, Type.array, description, undefined, items);
    }

    protected addField(
        name: string,
        type: Type,
        description?: string,
        properties?: ISchema,
        items?: BaseField | ObjectField | ItemField,
    ): void {
        this.fields.push({
            name,
            type,
            description,
            properties,
            items,
        });
    }

    public generate(): ISchema {
        const data: ISchema = {};

        for (const item of this.fields) {
            switch (item.type) {
                case Type.array:
                    data[item.name] = {
                        type: Type.array,
                        description: item.description,
                        items: item.items,
                    };
                    break;
                case Type.object:
                    data[item.name] = {
                        type: Type.object,
                        description: item.description,
                        properties: item.properties,
                    };
                    break;
                default:
                    data[item.name] = {
                        type: item.type,
                        description: item.description,
                    };
                    break;
            }
        }

        return data;
    }
}
