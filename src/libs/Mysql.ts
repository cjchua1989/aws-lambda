import { Connection, createConnection } from 'typeorm';
import { retrieve } from './Kms';

enum Dialect {
    mysql = 'mysql',
}

interface DBConnection {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    dialect: Dialect;
    entities: string[];
}

interface DBConnections {
    main: DBConnection;
    [propName: string]: DBConnection;
}

interface ActiveConnections {
    [key: string]: Connection;
}

const connections: DBConnections = {
    main: {
        host: process.env.MYSQLDB_URL ?? '127.0.0.1',
        port: process.env.MYSQLDB_PORT ? parseInt(process.env.MYSQLDB_PORT) : 3306,
        username: process.env.MYSQLDB_USERNAME ? process.env.MYSQLDB_USERNAME : 'root',
        password: process.env.MYSQLDB_PASSWORD ? process.env.MYSQLDB_PASSWORD : '',
        database: process.env.MYSQLDB_NAME ? process.env.MYSQLDB_NAME : 'serverless',
        dialect: Dialect.mysql,
        entities: [__dirname + '/../models/*{.ts,.js}'],
    },
};

let active: ActiveConnections = {};

export class Databases {
    static async getConnection(conn = 'main'): Promise<Connection> {
        if (typeof active[conn] === 'undefined') {
            const config = connections[conn];

            active[conn] = await createConnection({
                type: config.dialect,
                host: config.host,
                port: config.port,
                username: config.username,
                password: await retrieve(config.password),
                database: config.database,
                entities: config.entities,
                timezone: '+08:00',
                dateStrings: ['DATETIME'],
                charset: 'utf8mb4_unicode_ci',
            });
        }

        return active[conn];
    }

    static async closeConnection(): Promise<void> {
        const closing: Array<Promise<void>> = [];

        for (const key in active) {
            if (active.hasOwnProperty(key)) {
                const connection: Connection = active[key];
                closing.push(connection.close());
            }
        }

        active = {};

        await Promise.all(closing);
    }
}
