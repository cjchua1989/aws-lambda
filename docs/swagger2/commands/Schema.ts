import { Attribute, Structure, Types } from './Types';

export class Schema {
    protected calculate_required = true;
    protected structure: Structure = {};

    get index(): string {
        return this.constructor.name;
    }

    get compile(): Attribute {
        return Types.OBJECT(this.structure, 'Response Structure', this.calculate_required);
    }

    addAttribute(name: string, attribute: Attribute): void {
        this.structure[name] = attribute;
    }

    baseResponse(): void {
        this.addAttribute('code', Types.NUMBER('Machine readable code'));
        this.addAttribute('message', Types.NUMBER('Human readable message'));
    }
}

export class ResponseSchema extends Schema {
    protected calculate_required = false;
    protected structure: Structure = {};
    constructor() {
        super();
        this.baseResponse();
    }

    addPagination(): void {
        const pagination = Types.OBJECT(
            {
                current_page: Types.NUMBER('Current page of the list'),
                max_page: Types.NUMBER('Maximum page of the list'),
            },
            'Pagination information',
        );
        this.addAttribute('pagination', pagination);
    }
}
