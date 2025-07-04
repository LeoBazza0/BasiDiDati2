// NON SO SE CI VA SOLO QUESTO IN QUESTO FILE 

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Fotogram',
    password: 'unimi',
    port: 5432,
});

module.exports = pool;
