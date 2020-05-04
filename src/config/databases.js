const Sequelize = require('sequelize');

const connections = {
    main: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
    },
};

const active = {};

const getConnection = async (conn = 'main') => {
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
