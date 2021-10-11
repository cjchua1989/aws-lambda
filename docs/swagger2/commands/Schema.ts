import { pascalCase } from 'case-anything';
import { Attribute, Structure, Types } from './Types';

export class Schema {
    protected _name: string;
    protected structure: Structure = {};

    set name(name: string) {
        this._name = pascalCase(name);
    }

    get index(): string {
        return this._name;
    }

    get compile(): any {
        return Types.OBJECT(this.structure);
    }


    addAttribute(name: string, attribute: Attribute): void {
        this.structure[name] = attribute;
    }

    baseResponse(): void {
        this.addAttribute('code', Types.NUMBER('Machine readable code'));
        this.addAttribute('message', Types.NUMBER('Human readable message'));
    }
}
