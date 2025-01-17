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

    //#region get target_user_ip
    const ipQuery = `SELECT REPLACE(JSON_EXTRACT(settings, '$.country_ip'), '"', '') as target_user_ip FROM user WHERE user_id = ?`;
    const data1 = await db.query<{ target_user_ip: string }[]>(ipQuery, [target_user_id]);
    if (!data1 || data1.length === 0)
      return res.status(400).json({ result: null, error: "Could not fetch IP of target user." });

    const target_user_ip = data1[0].target_user_ip;
    //#endregion

    const query = `INSERT IGNORE INTO user_block (user_id, target_user_id, target_user_ip) VALUES(?, ?, ?)`;
    const result = await db.query(query, [user_id, target_user_id, target_user_ip]);

    res.status(200).json({ result: true, error: null });
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
} | null;
