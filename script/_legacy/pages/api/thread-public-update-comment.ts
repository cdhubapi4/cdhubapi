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
    const { comment_id, content }: { comment_id: string; content: string } = req.body;
    if (typeof comment_id !== "number") return res.status(400).json({ result: null, error: "no body: thread_id" });
    if (typeof content !== "string") return res.status(400).json({ result: null, error: "no body: content" });
    //#endregion

    //#region query excute
    const query1 = `UPDATE thread_public_comment SET content = ?, is_content_modified = 1 WHERE comment_id = ? AND created_user_id = ?;`;
    const result1 = await db.query<any>(query1, [content, comment_id, user_id]);
    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
