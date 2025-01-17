import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { thread_id } = req.query;
    if (typeof thread_id !== "string") return res.status(400).json({ result: null, error: "no query: thread_id" });
    //#endregion

    //#region query excute
    const query1 = `-- hot
SELECT last_index, profile_emoji, main_index, thread_id, title, content, tag, created_user_id, \`view\`,	person_like_count, person_dislike_count, comment_count, modified_at, created_at 
FROM thread_public 
where deleted_at is null and thread_id = ?`;
    const result1 = await db.query<any>(query1, [thread_id]);
    res.status(200).json({ result: result1[0], error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
