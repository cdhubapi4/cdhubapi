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

    //#region query excute
    const query = `SELECT u.user_id, u.nickname, u.profile_emoji 
      FROM user_block ub
      LEFT JOIN user u ON u.user_id = ub.target_user_id
      WHERE ub.user_id = ? and u.user_id is not null;`;
    const result = await db.query(query, [user_id]);

    res.status(200).json({ result: result, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
