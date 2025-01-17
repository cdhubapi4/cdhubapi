import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "220.70.31.85",
  port: 3306,
  user: "admin",
  password: "Tkarnr78^@",
  database: "cdhub",
  waitForConnections: true,
  connectionLimit: 1023,
  queueLimit: 0,
});
