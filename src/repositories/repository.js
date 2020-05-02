'use strict';

/**
 * Find data via column key
 *
 * @param dbClient
 * @param table
 * @param id
 * @param idColumn
 * @param columns
 * @returns {Promise<boolean|*>}
 */
const find = async (dbClient, table, id, idColumn = 'id', columns = ["*"]) => {
    let sql = "SELECT " + columns.join(", ") + " FROM ?? WHERE ?? = ? LIMIT 1";
    let options = [table, idColumn, id];

    let result = await query(dbClient, sql, options);

    if(result.length) return result[0];

    return false;
};

/**
 * Insert data
 *
 * @param dbClient
 * @param payload
 * @returns {Promise<unknown>}
 */
const insert = async (dbClient, payload) => {
    const {table, keyValues} = payload;

    const options = [table, keyValues];
    const sql = `INSERT INTO ?? SET ?`;

    return await query(dbClient, sql, options);
};

/**
 * Update data
 *
 * @param dbClient
 * @param payload
 * @returns {Promise<any>}
 */
const update = async (dbClient, payload) => {
    const {table, keyValues, conditions, conditionsValues} = payload;

    const options = [table, keyValues, ...conditionsValues];
    const sql = `UPDATE ?? SET ? ${conditions}`;

    const result = await query(dbClient, sql, options);

    return (result.length) ? result : false;
}

/**
 * Query sql statement
 *
 * @param dbClient
 * @param sql
 * @param options
 * @returns {Promise<unknown>}
 */
const query = (dbClient, sql, options) => {
    return new Promise((resolve, reject) => {
        dbClient.query(
            sql,
            options,
            (err, results, _fields) => {
                if (err) {
                    reject(err);
                    console.log('error', err);
                    const dbErrorResponse = {
                        message: `Something went wrong.`,
                    };
                    throw(dbErrorResponse);
                }

                resolve(results);
            }
        )
    });
};

module.exports = {
    query,
    find,
    insert,
    update
};
