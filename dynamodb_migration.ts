
import { v4 } from 'uuid';
import * as faker from 'faker';

import { client } from './src/libs/DynamoDB';
import { CreateTableInput } from 'aws-sdk/clients/dynamodb';
import { Logger } from './src/libs/Logger';
import { DynamoUserModel } from './src/models/DynamoUserModel';
import { GSI, LSI } from './src/repositories/DynamoRepository';
import { DynamoUserRepository } from './src/repositories/DynamoUserRepository';
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

         // SEEDERS //
         const dynamoUserRepository = new DynamoUserRepository();

         for(let i=0; i<15; i++){
            const user = new DynamoUserModel();
            user.email = faker.internet.email();
            user.name = faker.name.firstName();
            user.mobile = `09${faker.datatype.number(999999999).toString().padStart(9, '0')}`;
            user.password = faker.random.word();
            user.user_id = v4();
            await dynamoUserRepository.create(user);
         }

        Logger.info('Migration Status: ', 'Success');
    } catch (error) {
        Logger.info('Migration Status: ', 'Failed');
        Logger.error('DynamoDB.Migration', {
            error,
        });
    }
}

migrate().then();
