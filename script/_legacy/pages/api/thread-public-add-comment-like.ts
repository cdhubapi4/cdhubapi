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
    const { comment_id }: { comment_id: number } = req.body;
    if (typeof comment_id !== "number") return res.status(400).json({ result: null, error: "no body: comment_id" });
    //#endregion

    //#region query excute
    // insert like
    const query1 = `INSERT IGNORE INTO thread_public_comment_like (comment_id, user_id) VALUES (?, ?);`;

    // update like_count + 1
    const query2 = `UPDATE thread_public_comment SET like_count = like_count + 1 WHERE comment_id = ?;`;
    const result1 = await db.query<any>(query1 + query2, [comment_id, user_id, comment_id]);
    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
