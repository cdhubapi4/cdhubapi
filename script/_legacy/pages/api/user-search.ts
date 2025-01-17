import { encrypt } from "@/components/util/Crypto";
import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    // const { user_id } = userData;
    //#endregion

    //#region params check
    const { q } = req.query;
    if (typeof q !== "string") return res.status(400).json({ result: null, error: "no params: q" });
    if (q.length < 2) return res.status(400).json({ result: null, error: "min length 2 params: q" });
    //#endregion

    //#region query excute
    const query = `
      select u.user_id, u.nickname, u.profile_emoji, u.\`level\`
      from \`user\` u 
      where nickname not like 'Anonymous-%' 
        and nickname like ?
      limit 5`;
    const result = await db.query<UserSearchResponse[]>(query, [q + "%"]);
    res.status(200).json({ result: encrypt(result).toString(), error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

export type UserSearchResponse = {
  user_id: number;
  nickname: string;
  profile_emoji: string;
  level: number;
}[];
