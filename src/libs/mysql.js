const mysql = require('mysql');
const { decrypt } = require('./kms');

/**
 * Create new mysql connection
 *
 * @returns {Promise<*>}
 */
module.exports.createConnection = async () => {
    return mysql.createPool({
        connectionLimit: 30,
        connectTimeout: 60 * 60 * 1000,
        host: process.env.MYSQLDB_URL,
        user: process.env.MYSQLDB_USERNAME,
        password: await decrypt(
            process.env.MYSQLDB_PASSWORD,
            'MYSQLDB_PASSWORD'
        ),
        database: process.env.MYSQLDB_NAME,
    });
};

/**
 * Close mysql connection
 *
 * @param connection
 * @returns {Promise<unknown>}
 */
module.exports.closeConnection = async (connection) => {
    return new Promise((resolve) => {
        connection.end((error) => {
            console.log('Connection Closed');
            console.log(error);
            resolve();
        });
    });
};
