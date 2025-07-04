const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Fotogram', // nome database in postgres
    password: 'unimi', // password dataase in postgres
    port: 5432,
});

module.exports = pool;
