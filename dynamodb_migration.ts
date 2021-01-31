import { client } from './src/libs/DynamoDB';
import { CreateTableInput } from 'aws-sdk/clients/dynamodb';
import { Logger } from './src/libs/Logger';
import { GSI, LSI } from './src/repositories/DynamoRepository';
const TABLE_NAME = process.env.TABLE_NAME ?? '';

async function migrate() {
    const table: CreateTableInput = {
        TableName: TABLE_NAME,
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
        },
        AttributeDefinitions: [
            {
                AttributeName: 'lookup_key',
                AttributeType: 'S',
            },
            {
                AttributeName: 'reference_key',
                AttributeType: 'S',
            },
            {
                AttributeName: 'id',
                AttributeType: 'S',
            },
            {
                AttributeName: 'created_at',
                AttributeType: 'S',
            },
        ],
        KeySchema: [
            {
                AttributeName: 'lookup_key',
                KeyType: 'HASH',
            },
            {
                AttributeName: 'reference_key',
                KeyType: 'RANGE',
            },
        ],
        LocalSecondaryIndexes: [
            {
                IndexName: LSI.ID_INDEX,
                KeySchema: [
                    {
                        AttributeName: 'lookup_key',
                        KeyType: 'HASH',
                    },
                    {
                        AttributeName: 'id',
                        KeyType: 'RANGE',
                    },
                ],
                Projection: {
                    ProjectionType: 'ALL',
                },
            },
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: GSI.CREATED_AT_INDEX,
                KeySchema: [
                    {
                        AttributeName: 'reference_key',
                        KeyType: 'HASH',
                    },
                    {
                        AttributeName: 'created_at',
                        KeyType: 'RANGE',
                    },
                ],
                Projection: {
                    ProjectionType: 'ALL',
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1,
                },
            },
        ],
    };

    try {
        await client.createTable(table).promise();
        Logger.info('Migration Status: ', 'Success');
    } catch (error) {
        Logger.info('Migration Status: ', 'Failed');
        Logger.error('DynamoDB.Migration', {
            error,
        });
    }
}

migrate().then();
