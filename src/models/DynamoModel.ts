import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

const TABLE_NAME = process.env.TABLE_NAME ?? '';

@table(TABLE_NAME)
export class DynamoModel {
    @hashKey()
    lookup_key: string;
    @rangeKey()
    reference_key: string;

    @attribute()
    id: string;

    @attribute()
    created_at: string;
    @attribute()
    updated_at: string;
    @attribute()
    deleted_at: string;
}
