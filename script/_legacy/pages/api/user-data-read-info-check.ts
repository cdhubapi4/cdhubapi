import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { UserDataType } from "@/components/util/getUserData";
import { encrypt } from "@/components/util/Crypto";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    const { user_id } = userData;
    //#endregion

    //#region query excute
    const query = `
      SELECT
          u.user_id, u.gender, u.bio, u.nickname, u.profile_emoji, IF(u.password is null, 0, 1) isPassword, u.settings, u.created_at
      FROM
          user u
      WHERE
          u.user_id = ? and deleted_at is null;`;
    const result = await db.query<UserDataType & { settings: string }[]>(query, [user_id]);
    if (result.length === 0) {
      res.setHeader(
        "Set-Cookie",
        "key=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict"
      );
      return res.status(200).json({ result: null, error: "no user" });
    }

    const checkedUserData = { ...result[0], settings: JSON.parse(result[0].settings) };
    res.setHeader("Set-Cookie", `key=${encrypt(checkedUserData as object)}; Path=/; HttpOnly; Secure; SameSite=Strict`);
    res.status(200).json({ result: checkedUserData, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

// export type UserDataReadResponse = {
//   country: string | null;
//   language: string | null;
//   exp: number;
//   level: number;
//   created_at: string;
//   last_active_at: string;
//   is_notification: 0 | 1;
//   is_follow: 0 | 1;
//   is_blocked: 0 | 1;
// } | null;
export type UserDataReadResponse = {
  user_id: number;
  gender: "female" | "male" | "none";
  bio: string | null;
  nickname: string | null;
  profile_emoji: string | null;
  settings: object | null;
  created_at: string | null;
  isPassword: 1 | 0;
} | null;
