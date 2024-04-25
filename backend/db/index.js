const { Pool } = require('pg');
require('dotenv').config();  // Make sure you have dotenv configured to use environment variables

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,  // Make sure DATABASE_URL is correctly set in your .env file
});

const query = (text, params, callback) => {
    return pool.query(text, params, callback);
};

module.exports = {
    query
};
