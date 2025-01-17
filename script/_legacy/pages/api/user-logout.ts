import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    // const { user_id } = userData;
    //#endregion

    //#region query excute
    res.setHeader(
      "Set-Cookie",
      "key=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict"
    );
    res.status(200).json({ result: true, error: null });
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
