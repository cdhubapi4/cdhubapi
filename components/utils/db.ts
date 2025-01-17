import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "172.30.1.72",
  port: 3306,
  user: "admin",
  password: "Tkarnr78^@",
  database: "cdhub",
  waitForConnections: true,
  connectionLimit: 1023,
  queueLimit: 0,
});
