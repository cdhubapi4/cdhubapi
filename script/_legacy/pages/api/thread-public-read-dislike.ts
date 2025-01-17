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
    const { thread_id } = req.query;
    if (typeof thread_id !== "string") return res.status(400).json({ result: null, error: "no body: thread_id" });
    //#endregion

    //#region query excute
    // get my dislike
    const query1 = `SELECT COUNT(user_id) > 0 is_checked FROM thread_public_dislike WHERE thread_id = ? AND user_id = ?;`;
    const result1 = await db.query<any>(query1, [thread_id, user_id]);
    res.status(200).json({ result: result1[0].is_checked, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
