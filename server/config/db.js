/**
 * Database connection configuration.
 * All credentials are read from environment variables — NEVER hardcode here.
 * Copy server/.env.example → server/.env and fill in real values.
 */
require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port:     process.env.DB_PORT || 3306,
  database: process.env.DB_NAME,
});

db.connect(function (err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Database connected');
});

module.exports = db;

