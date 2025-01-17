import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region query excute
    const query1 = `
(SELECT 
    title, 
    183 * thread_id AS thread_id_mul, 
    content AS description, 
    DATE_FORMAT(tp.created_at, '%a, %d %b %Y %T +0900') AS pubDate, 
    thread_id AS guid, 
    CONCAT(u.profile_emoji, " ", u.nickname COLLATE utf8mb4_unicode_ci) AS author, 
    tp.tag COLLATE utf8mb4_unicode_ci AS category
FROM 
    thread_public tp
LEFT JOIN 
    user u ON u.user_id = tp.created_user_id
WHERE 
    tp.tag LIKE "%뉴스%"
ORDER BY 
    thread_id DESC 
LIMIT 10)
UNION ALL
(SELECT 
    title, 
    183 * thread_id AS thread_id_mul, 
    content AS description, 
    DATE_FORMAT(tp.created_at, '%a, %d %b %Y %T +0900') AS pubDate, 
    thread_id AS guid, 
    CONCAT(u.profile_emoji, " ", u.nickname COLLATE utf8mb4_unicode_ci) AS author, 
    tp.tag COLLATE utf8mb4_unicode_ci AS category
FROM 
    thread_public tp
LEFT JOIN 
    user u ON u.user_id = tp.created_user_id
WHERE 
    tp.tag NOT LIKE "%뉴스%"
ORDER BY 
    thread_id DESC 
LIMIT 40)
LIMIT 50;`;
    const result1 = await db.query(query1);
    res.status(200).json({ result: result1 });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
