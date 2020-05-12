const Sequelize = require('sequelize');

const connections = {
    main: {
        host: process.env.MYSQLDB_URL,
        port: process.env.MYSQLDB_PORT,
        username: process.env.MYSQLDB_USERNAME,
        password: process.env.MYSQLDB_PASSWORD,
        database: process.env.MYSQLDB_NAME,
        dialect: 'mysql',
    },
};

const active = {};

const getConnection = (conn = 'main') => {
    if (!active[conn]) {
        const config = connections[conn];

        active[conn] = new Sequelize(
            config.database,
            config.username,
            config.password,
            {
                host: config.host,
                port: config.port,
                dialect: config.dialect,
            }
        );
    }

    return active[conn];
};

const closeConnection = async () => {
    const closing = [];
    const forClosing = active.values();

    for (let i = 0; i < forClosing.length; i += 1) {
        const connection = forClosing[i];
        closing.push(connection.close());
    }

    await Promise.all(closing);
};

module.exports = {
    getConnection,
    closeConnection,
};
