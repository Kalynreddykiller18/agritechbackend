import mysql from "mysql2/promise";

// creating connection pool
const connection = await mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DB,
  timezone: "+05:30",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default connection;
