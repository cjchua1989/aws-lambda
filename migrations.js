require('dotenv').config();

const mysql = require('mysql');
const migrations = require('mysql-migrations');

const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

const {
    STAGE,
    MIGRATION_MYSQLDB_URL,
    MIGRATION_MYSQLDB_USERNAME,
    MIGRATION_MYSQLDB_PASSWORD,
    MIGRATION_MYSQLDB_NAME,
    MIGRATION_MYSQLDB_PORT,
} = process.env;

async function retrieve(path) {
    if(STAGE === 'local') return path;

    try {
        const data = await ssm
            .getParameter({
                Name: path,
                WithDecryption: true,
            })
            .promise();


        return data && data.Parameter && data.Parameter.Value
                ? data.Parameter.Value
                : '';
    } catch (error) {
        console.log('Retrieve error:', error);
        return path;
    }
}

async function execute() {
    const connection = mysql.createPool({
        connectionLimit: 10,
        host: MIGRATION_MYSQLDB_URL,
        user: MIGRATION_MYSQLDB_USERNAME,
        password: await retrieve(MIGRATION_MYSQLDB_PASSWORD),
        database: MIGRATION_MYSQLDB_NAME,
        port: MIGRATION_MYSQLDB_PORT,
    });

    migrations.init(connection, `${__dirname}/migrations`);
}

execute().then();
