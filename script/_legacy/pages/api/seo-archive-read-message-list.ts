import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { id } = req.query;
    if (typeof id !== "string") return res.status(400).json({ result: null, error: "no params: id" });
    //#endregion

    //#region query excute
    const query = `select ti.\`index\`, ti.index_id, ti.content, ti.created_at, u.nickname, u.profile_emoji
from thread_index ti
left join \`user\` u on u.user_id = ti.created_user_id 
where thread_id = ?;`;
    const params = [id];
    const result = await db.query(query, params);
    res.status(200).json({ result: result, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
