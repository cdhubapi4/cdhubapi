import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    const { user_id, nickname, profile_emoji } = userData;
    //#endregion

    //#region params check
    const {
      thread_id,
      content,
      parent_comment_id,
      reply_group_id,
    }: {
      thread_id: number;
      content: string;
      parent_comment_id: number | undefined;
      reply_group_id: number | undefined;
    } = req.body;
    if (typeof thread_id !== "number") return res.status(400).json({ result: null, error: "no body: thread_id" });
    if (typeof content !== "string") return res.status(400).json({ result: null, error: "no body: content" });
    //#endregion

    //#region query excute
    if (parent_comment_id && reply_group_id) {
      // reply comment
      const query1 = `INSERT INTO thread_public_comment (thread_id, reply_group_id, reply_group_index, title, content, created_user_id, profile_emoji, reply_parent_comment_id)
      SELECT ?, ?, IFNULL(MAX(reply_group_index), 0) + 1, ?, ?, ?, ?, ?
      FROM thread_public_comment c
      WHERE thread_id = ? and reply_group_id = ?;`;
      const params = [
        thread_id,
        reply_group_id,
        nickname,
        content,
        user_id,
        profile_emoji,
        parent_comment_id,
        thread_id,
        reply_group_id,
      ];
      const query2 = `UPDATE thread_public_comment SET child_comment_count = child_comment_count + 1 WHERE comment_id = ?;`;
      const query3 = `UPDATE thread_public SET comment_count = comment_count + 1 WHERE thread_id = ?;`;
      const result = await db.query<any>(query1 + query2 + query3, [...params, parent_comment_id, thread_id]);
    } else {
      // create new comment
      const query1 = `INSERT INTO thread_public_comment (thread_id, reply_group_id, reply_group_index, title, content, created_user_id, profile_emoji)
      SELECT ?, IFNULL(MAX(reply_group_id), 0) + 1, 1, ?, ?, ?, ?
      FROM thread_public_comment c
      WHERE thread_id = ?;`;
      const query3 = `UPDATE thread_public SET comment_count = comment_count + 1 WHERE thread_id = ?;`;
      const result = await db.query<any>(query1 + query3, [
        thread_id,
        nickname,
        content,
        user_id,
        profile_emoji,
        thread_id,
        thread_id,
      ]);
    }

    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
