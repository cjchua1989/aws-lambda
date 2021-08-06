import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { DynamoModel } from './DynamoModel';
export const LOOKUP_KEY = 'USER';
export const REFERENCE_KEY = 'USER:<USER_ID>';

export class DynamoUserModel extends DynamoModel {
    @attribute()
    name: string;

    @attribute()
    email: string;

    @attribute()
    mobile: string;

    @attribute()
    password: string;

    get user_id(): string {
        return this.id;
    }

    set user_id(uuid: string) {
        this.id = uuid;
        this.lookup_key = LOOKUP_KEY;
        this.reference_key = REFERENCE_KEY.replace('<USER_ID>', this.user_id);
    }
}
