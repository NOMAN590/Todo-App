const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',      // apna username
    host: 'localhost',
    database: 'todo_app',  // space aur capital letters hata ke
    password: 'masterpassword',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
