/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        title: {
            type: 'VARCHAR(50)',
            notNull: false
        },
        body: {
            type: 'TEXT',
            notNull: false
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: false
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        updated_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('threads');
};
