import { decrypt } from "@/components/util/Crypto";
import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    const { user_id } = userData;
    //#endregion

    //#region params check
    const { id } = req.query;
    if (typeof id !== "string") return res.status(400).json({ result: null, error: "no params: data" });

    const target_user_id = decrypt(id);
    //#endregion

    //#region query excute
    const query = `
      SELECT
          REPLACE(JSON_EXTRACT(u.settings, '$.country'), '"', '') AS country,
          REPLACE(JSON_EXTRACT(u.settings, '$.language'), '"', '') AS language,
          u.exp,
          u.level,
          u.created_at,
          IFNULL(e.modified_at, u.created_at) AS last_active_at,
          IF(EXISTS(SELECT 1 FROM user_webpush_device WHERE user_id = ?), 1, 0) AS is_notification,
          IF(EXISTS(SELECT 1 FROM user_follow f WHERE f.send_user_id = ? and f.receive_user_id = ?), 1, 0) AS is_follow,
          IF(EXISTS(
            SELECT 1 
            FROM user_block b 
            WHERE b.user_id = ? 
            AND (b.target_user_id = u.user_id 
            OR b.target_user_ip = REPLACE(JSON_EXTRACT(u.settings, '$.country_ip'), '"', ''))
          ), 1, 0) AS is_blocked
      FROM
          user u
      LEFT JOIN
          user_exp_data e ON e.user_id = u.user_id
      WHERE
          u.user_id = ?;`;

    const result = await db.query<{ level: number; exp: number }[]>(query, [
      target_user_id,
      user_id,
      target_user_id,
      user_id,
      target_user_id,
    ]);
    if (result.length === 0) return res.status(400).json({ result: null, error: "no user" });

    res.status(200).json({ result: result[0], error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

export type UserDataReadResponse = {
  country: string | null;
  language: string | null;
  exp: number;
  level: number;
  created_at: string;
  last_active_at: string;
  is_notification: 0 | 1;
  is_follow: 0 | 1;
  is_blocked: 0 | 1;
} | null;
