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
    const {
      comment_id,
      reply_group_index,
      reply_parent_comment_id,
      created_user_id,
      thread_id,
    }: {
      comment_id: string;
      reply_group_index: number;
      reply_parent_comment_id: number;
      created_user_id: number;
      thread_id: number;
    } = req.body;
    if (typeof comment_id !== "number") return res.status(400).json({ result: null, error: "no body: comment_id" });
    if (typeof reply_group_index !== "number")
      return res.status(400).json({ result: null, error: "no body: reply_group_index" });
    if (typeof created_user_id !== "number")
      return res.status(400).json({ result: null, error: "no body: created_user_id" });
    if (typeof thread_id !== "number") return res.status(400).json({ result: null, error: "no body: thread_id" });
    if (created_user_id != user_id)
      return res.status(403).json({ result: null, error: "Permission denied or comment not found." });
    //#endregion

    //#region query excute
    // 1 delete comment
    const query1 = `UPDATE thread_public_comment SET deleted_at = CURRENT_TIMESTAMP WHERE comment_id = ?;`;
    // 2 subtack thread comment_count
    const query2 = `UPDATE thread_public SET comment_count = GREATEST(comment_count - 1, 0) WHERE thread_id = ?;`;
    // 3 subtrack parent_comment comment_count
    const query3 = `UPDATE thread_public_comment SET child_comment_count = GREATEST(child_comment_count - 1, 0) WHERE comment_id = ?;`;
    await db.query(query1 + query2 + query3, [comment_id, thread_id, reply_parent_comment_id || -1]);

    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
