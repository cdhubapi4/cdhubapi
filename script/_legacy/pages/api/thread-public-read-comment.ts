import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export type CommentType = {
  comment_id: number;
  thread_id: number;
  title: string;
  content: string | null;
  created_user_id: number;
  profile_emoji: string;
  like_count: number;
  dislike_count: number;
  created_at: string;
  is_content_modified: 0 | 1;
  is_like: 0 | 1; //my
  is_dislike: 0 | 1; //my
  reply_parent_comment_id: number | null;
  reply_group_index: number;
  reply_group_id: number;
  child_comment_count: number;
  deleted_at: string | null;
};

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
    const query1 = `
    SELECT 
      tpc.comment_id, tpc.thread_id, tpc.title, tpc.content, tpc.created_user_id, tpc.profile_emoji, tpc.like_count, tpc.dislike_count, tpc.created_at,
      tpc.is_content_modified, tpc.child_comment_count,
      CASE WHEN tpl.user_id IS NULL THEN 0 ELSE 1 END AS is_like,
      CASE WHEN tpdl.user_id IS NULL THEN 0 ELSE 1 END AS is_dislike,
      tpc.reply_parent_comment_id, tpc.reply_group_index, tpc.reply_group_id, tpc.deleted_at
    FROM thread_public_comment AS tpc
    LEFT JOIN thread_public_comment_like AS tpl ON tpc.comment_id = tpl.comment_id AND tpl.user_id = ?
    LEFT JOIN thread_public_comment_dislike AS tpdl ON tpc.comment_id = tpdl.comment_id AND tpdl.user_id = ?
    WHERE tpc.thread_id = ? AND ((tpc.child_comment_count != 0 and tpc.deleted_at is not null) OR (tpc.deleted_at is null))
    ORDER BY tpc.reply_group_id DESC, tpc.reply_group_index ASC;`;
    const result1 = await db.query<CommentType[]>(query1, [user_id, user_id, thread_id]);
    res.status(200).json({ result: result1, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
