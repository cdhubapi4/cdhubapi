// db.ts
// https://www.serverless.com/plugins/serverless-mysql
// PEM Key download : https://curl.se/docs/caextract.html
// DBeaver SSL Usage: https://github.com/planetscale/discussion/discussions/105

import mysql from "serverless-mysql";
const USE_LOCALHOST_DB = process.env.USE_LOCALHOST_DB === "1";
// console.info("USE_LOCALHOST_DB:", USE_LOCALHOST_DB);

export const db = mysql({
  config: {
    host: USE_LOCALHOST_DB ? "localhost" : "aws.connect.psdb.cloud",
    user: USE_LOCALHOST_DB ? "root" : "kvansvz0knwg5wzyupvk",
    password: USE_LOCALHOST_DB ? "1234" : "pscale_pw_jGvr3PZjxXn5udlCWrhlGZFFjbtbr9QqQuVoG69N4ar",

    port: 3306,
    database: USE_LOCALHOST_DB ? "freedb_tomholdplacer" : "sp",
    charset: "utf8mb4",
    multipleStatements: true,
    timezone: "Asia/Seoul",

    ssl: {
      rejectUnauthorized: true,
    },
  },
});
