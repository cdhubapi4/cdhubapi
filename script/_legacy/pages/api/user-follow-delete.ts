import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import { decrypt } from "@/components/util/Crypto";
import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";

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
    const query = `DELETE FROM user_follow WHERE send_user_id = ? AND receive_user_id = ?`;
    const result = await db.query(query, [user_id, target_user_id]);

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
