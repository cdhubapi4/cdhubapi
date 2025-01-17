import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import { getMaxExp } from "./user-level-add-exp";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    const { user_id } = userData;
    //#endregion

    //#region query excute
    const query = `SELECT \`level\`, \`exp\` FROM user where user_id = ? and deleted_at is null;`;
    const result = await db.query<{ level: number; exp: number }[]>(query, [user_id]);
    if (result.length === 0) return res.status(400).json({ result: null, error: "no user" });

    const { level, exp } = result[0];
    res.status(200).json({ result: { level, exp, max: getMaxExp(level) }, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

export type UserLevelReadResponse = {
  level: number;
  exp: number;
} | null;
