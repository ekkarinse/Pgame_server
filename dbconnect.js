const dotenv = require('dotenv');
const mysql = require('mysql');

// configraration with env. 
dotenv.config();
module.exports = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE_DATABASE_NAME, 
    port: process.env.DATABASE_PORT,
});

