import knex from 'knex';

export abstract class DBManager {
    protected static connection = knex({
        client: 'sqlite3',
        connection: {
            filename: './src/database/lab-token.db',
        },
        useNullAsDefault: true,
        pool: {
            min: 0,
            max: 1,
            afterCreate: (conn: any, cb: any) => {
                conn.run('PRAGMA foreing_keys = ON', cb);
            },
        },
    });
}
