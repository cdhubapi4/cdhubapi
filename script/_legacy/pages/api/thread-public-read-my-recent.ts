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
    const query1 = `SELECT tp.last_index, tp.profile_emoji, tp.main_index, tp.thread_id, tp.title, tp.content, tp.tag, tp.created_user_id, tp.\`view\`, tp.person_like_count, tp.person_dislike_count, tp.comment_count, tp.modified_at, tp.created_at 
FROM thread_public_recent tpr
LEFT JOIN thread_public tp ON tpr.thread_id = tp.thread_id
WHERE tpr.user_id = ? AND tp.deleted_at IS NULL AND tpr.thread_id is not null and tp.thread_id is not null
ORDER BY tpr.modified_at DESC
LIMIT 3;
`;
    const result1 = await db.query<any>(query1, [user_id]);
    res.status(200).json({ result: result1, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
