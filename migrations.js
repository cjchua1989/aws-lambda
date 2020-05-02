require('dotenv').config();

const migration = require('mysql-migrations');
const { createConnection } = require('./src/libs/mysql');

createConnection().then((connection) => {
    migration.init(connection, `${__dirname}/migrations`);
});
