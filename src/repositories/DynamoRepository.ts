import { docClient } from '../libs/DynamoDB';
import { mapper } from '../libs/DynamoDB';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { ExpressionAttributeNameMap } from 'aws-sdk/clients/dynamodb';
import { Carbon } from '../libs/Carbon';
import { DynamoModel } from '../models/DynamoModel';

const TABLE_NAME = process.env.TABLE_NAME ?? '';

export enum LSI {
    ID_INDEX = 'IdIndex',
}

export enum GSI {
    CREATED_AT_INDEX = 'CreatedAtIndex',
}

export interface Filter {
    [key: string]: string;
}
export enum SelectAttribute {
    ALL_ATTRIBUTES = 'ALL_ATTRIBUTES',
    SPECIFIC_ATTRIBUTES = 'SPECIFIC_ATTRIBUTES',
    COUNT = 'COUNT',
}

export enum PAGE_ACTION {
    NEXT = 'NEXT',
    PREV = 'PREV',
}

export interface DynamoPaginationInfo {
    page?: PAGE_ACTION;
    key: string;
    limit: number;
    forward: boolean;
}

export class DynamoRepository<T extends DynamoModel> {
    static fieldsToExpression(fields: string[]): {
        FieldExpressionAttributeNames: ExpressionAttributeNameMap;
        ProjectionExpression: string;
    } {
        const FieldExpressionAttributeNames: ExpressionAttributeNameMap = {};
        const ProjectionExpression: string[] = [];

        for (let i = 0; i < fields.length; i += 1) {
            FieldExpressionAttributeNames[`#${fields[i]}`] = fields[i];
            ProjectionExpression.push(`#${fields[i]}`);
        }

        return {
            FieldExpressionAttributeNames,
            ProjectionExpression: ProjectionExpression.join(', '),
        };
    }
    static filtersToExpression(filters: Filter): {
        FilterExpressionAttributeValues: ExpressionAttributeNameMap;
        FilterExpression: string;
    } {
        const FilterExpression: string[] = [];
        const FilterExpressionAttributeValues: ExpressionAttributeNameMap = {};

        for (const index in filters) {
            if (Object.prototype.hasOwnProperty.call(filters, index)) {
                FilterExpressionAttributeValues[`:${index}`] = filters[index];
                FilterExpression.push(`${index} = :${index}`);
            }
        }

        return {
            FilterExpressionAttributeValues,
            FilterExpression: FilterExpression.join(' AND '),
        };
    }
    static keysToExpression(keys: Filter): {
        KeyExpressionAttributeValues: ExpressionAttributeNameMap;
        KeyConditionExpression: string;
    } {
        const KeyConditionExpression: string[] = [];
        const KeyExpressionAttributeValues: ExpressionAttributeNameMap = {};

        for (const index in keys) {
            if (Object.prototype.hasOwnProperty.call(keys, index)) {
                KeyExpressionAttributeValues[`:${index}`] = keys[index];
                KeyConditionExpression.push(`${index} = :${index}`);
            }
        }

        return {
            KeyExpressionAttributeValues,
            KeyConditionExpression: KeyConditionExpression.join(' AND '),
        };
    }

    public async create(item: T): Promise<T> {
        item.created_at = Carbon.nowFormattedWithHash();
        item.updated_at = Carbon.nowFormattedWithHash();
        return await mapper.put(item);
    }

    public async update(item: T): Promise<T> {
        item.updated_at = Carbon.nowFormattedWithHash();
        return mapper.put(item);
    }

    public async softDelete(item: T): Promise<T> {
        item.deleted_at = Carbon.nowFormattedWithHash();
        return mapper.put(item);
    }

    public async delete(item: T): Promise<void> {
        await mapper.delete(item);
    }

    public async get(Key: Filter): Promise<T> {
        const params = {
            TableName: TABLE_NAME,
            Key,
        };
        const response = await docClient.get(params).promise();
        return <T>response.Item;
    }

    public async query(
        fields: string[],
        keys: Filter,
        filters: Filter = {},
        index: string | undefined = undefined,
        limit: number | undefined = undefined,
    ): Promise<DocumentClient.ItemList | undefined> {
        const { FieldExpressionAttributeNames, ProjectionExpression } = DynamoRepository.fieldsToExpression(fields);
        const { KeyConditionExpression, KeyExpressionAttributeValues } = DynamoRepository.keysToExpression(keys);
        const { FilterExpression, FilterExpressionAttributeValues } = DynamoRepository.filtersToExpression(filters);

        const ExpressionAttributeNames = fields.length > 0 ? { ...FieldExpressionAttributeNames } : undefined;

        const params: DocumentClient.QueryInput = {
            TableName: TABLE_NAME,
            IndexName: index,
            ExpressionAttributeNames,
            ExpressionAttributeValues: {
                ...KeyExpressionAttributeValues,
                ...FilterExpressionAttributeValues,
            },
            ProjectionExpression: ProjectionExpression === '' ? undefined : ProjectionExpression,
            KeyConditionExpression,
            FilterExpression: FilterExpression === '' ? undefined : FilterExpression,
            Limit: limit,
        };

        const response = await docClient.query(params).promise();
        return response.Items;
    }

    public async countQuery(
        KeyConditionExpression: string,
        ExpressionAttributeValues: DocumentClient.ExpressionAttributeValueMap,
        IndexName: string | undefined = undefined,
    ): Promise<number> {
        const params: DocumentClient.QueryInput = {
            TableName: TABLE_NAME,
            KeyConditionExpression,
            ExpressionAttributeValues,
            IndexName,
            Select: SelectAttribute.COUNT,
        };

        const result = await docClient.query(params).promise();
        return result.Count ?? 0;
    }

    public async rawQuery(
        KeyConditionExpression: string,
        ExpressionAttributeValues: DocumentClient.ExpressionAttributeValueMap,
        IndexName: string | undefined = undefined,
        Select: SelectAttribute = SelectAttribute.ALL_ATTRIBUTES,
        ProjectionExpression: string | undefined = undefined,
        ExpressionAttributeNames: undefined | DocumentClient.ExpressionAttributeNameMap = undefined,
    ): Promise<DocumentClient.ItemList | undefined> {
        const params: DocumentClient.QueryInput = {
            TableName: TABLE_NAME,
            KeyConditionExpression,
            ExpressionAttributeValues,
            IndexName,
            Select,
            ProjectionExpression,
            ExpressionAttributeNames,
        };

        let items: DocumentClient.ItemList = [];
        let result: DocumentClient.QueryOutput;

        do {
            result = await docClient.query(params).promise();
            if (!result.Items) return undefined;
            items = [...items, ...result.Items];

            if (result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
            }
        } while (result.LastEvaluatedKey);

        return items;
    }

    public async rawScan(
        FilterExpression: DocumentClient.ConditionExpression,
        ExpressionAttributeValues: DocumentClient.ExpressionAttributeValueMap,
        IndexName: string | undefined = undefined,
        Select: SelectAttribute = SelectAttribute.ALL_ATTRIBUTES,
        ProjectionExpression: string | undefined = undefined,
        ExpressionAttributeNames: undefined | DocumentClient.ExpressionAttributeNameMap = undefined,
    ): Promise<DocumentClient.ItemList | undefined> {
        const params: DocumentClient.ScanInput = {
            TableName: TABLE_NAME,
            FilterExpression,
            ExpressionAttributeValues,
            IndexName,
            Select,
            ProjectionExpression,
            ExpressionAttributeNames,
        };

        let items: DocumentClient.ItemList = [];
        let result: DocumentClient.QueryOutput;

        do {
            result = await docClient.scan(params).promise();
            if (!result.Items) return undefined;
            items = [...items, ...result.Items];

            if (result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
            }
        } while (result.LastEvaluatedKey);

        return items;
    }

    public async paginateQuery(
        PageInfo: DynamoPaginationInfo,
        KeyConditionExpression: string,
        ExpressionAttributeValues: DocumentClient.ExpressionAttributeValueMap,
        IndexName: string | undefined = undefined,
        Select: SelectAttribute = SelectAttribute.ALL_ATTRIBUTES,
        ProjectionExpression: string | undefined = undefined,
        ExpressionAttributeNames: undefined | DocumentClient.ExpressionAttributeNameMap = undefined,
    ): Promise<{ data: DocumentClient.ItemList | undefined; key: string; forward: boolean }> {
        const params: DocumentClient.QueryInput = {
            TableName: TABLE_NAME,
            KeyConditionExpression,
            ExpressionAttributeValues,
            IndexName,
            Select,
            ProjectionExpression,
            ExpressionAttributeNames,
            Limit: PageInfo.limit,
        };

        if (PageInfo.key !== '') {
            params.ExclusiveStartKey = JSON.parse(PageInfo.key);
        }

        let data: DocumentClient.ItemList = [];
        let key = '';
        let forward = true;

        if (PageInfo.page === PAGE_ACTION.PREV) {
            forward = false;
            params.ScanIndexForward = false;
            if (PageInfo.key === '') {
                const item_count = await this.countQuery(KeyConditionExpression, ExpressionAttributeValues, IndexName);
                params.Limit = item_count % PageInfo.limit > 0 ? item_count % PageInfo.limit : PageInfo.limit;
            }
            if (PageInfo.forward) params.Limit = PageInfo.limit + 1;

            const result = await docClient.query(params).promise();
            if (result.LastEvaluatedKey) key = JSON.stringify(result.LastEvaluatedKey);
            if (result.Items) {
                data = result.Items.reverse().slice(0, PageInfo.limit);
            }
        } else {
            forward = true;
            if (!PageInfo.forward) params.Limit = PageInfo.limit + 1;

            const result = await docClient.query(params).promise();
            if (result.LastEvaluatedKey) key = JSON.stringify(result.LastEvaluatedKey);
            if (result.Items) {
                if (!PageInfo.forward) result.Items.shift();
                data = result.Items;
            }
        }

        return { data, key, forward };
    }
}
