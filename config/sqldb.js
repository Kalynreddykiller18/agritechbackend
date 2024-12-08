import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.SQL_PASS,
  database: process.env.SQL_DB,
});

export default connection;
