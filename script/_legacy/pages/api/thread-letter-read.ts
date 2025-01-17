import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { thread_id } = req.query;
    if (typeof thread_id !== "string") return res.status(400).json({ result: null, error: "no params: thread_id" });
    //#endregion

    //#region query excute
    const query1 = `
      select ti.\`index\`, ti.index_id, ti.content, ti.created_at,
      IFNULL(u.nickname, "Deleted User") nickname, IFNULL(u.profile_emoji, "❔") profile_emoji
      from thread_private_index ti
      left join \`user\` u on u.user_id = ti.created_user_id
      where ti.thread_private_id = ?;
    `;
    const result = await db.query(query1, [thread_id]);
    res.status(200).json({ result, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
