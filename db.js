const mysql = require('mysql2');

// Configure your MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'dheeraj@bbc', // Update with your MySQL password if not empty
    database: 'factory_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert the pool to use promises for async/await support
const promisePool = pool.promise();

module.exports = promisePool;
