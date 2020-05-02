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
        dbClient.query(sql, options, (error, results) => {
            if (error) {
                reject(error);
                throw new Error('Something went wrong.');
            }

            resolve(results);
        });
    });
};

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
const find = async (dbClient, table, id, idColumn = 'id', columns = ['*']) => {
    const sql = `SELECT ${columns.join(', ')} FROM ?? WHERE ?? = ? LIMIT 1`;
    const options = [table, idColumn, id];

    const result = await query(dbClient, sql, options);

    if (result.length) return result[0];

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
    const { table, keyValues } = payload;

    const options = [table, keyValues];
    const sql = `INSERT INTO ?? SET ?`;

    return query(dbClient, sql, options);
};

/**
 * Update data
 *
 * @param dbClient
 * @param payload
 * @returns {Promise<any>}
 */
const update = async (dbClient, payload) => {
    const { table, keyValues, conditions, conditionsValues } = payload;

    const options = [table, keyValues, ...conditionsValues];
    const sql = `UPDATE ?? SET ? ${conditions}`;

    const result = await query(dbClient, sql, options);

    return result.length ? result : false;
};

module.exports = {
    query,
    find,
    insert,
    update,
};
