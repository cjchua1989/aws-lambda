'use strict';

require('dotenv').config();

const { createConnection } = require("./src/libs/mysql");
const migration = require('mysql-migrations');

createConnection().then((connection) => {
    migration.init(connection, __dirname + '/migrations');
});
