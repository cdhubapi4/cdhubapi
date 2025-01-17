import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    // const { user_id } = userData;
    //#endregion

    //#region params check
    const { thread_id } = req.query;
    if (typeof thread_id !== "string") return res.status(400).json({ result: null, error: "no query: thread_id" });
    //#endregion

    //#region query excute
    const query1 = `    
    select ti.\`index\`, ti.index_id, ti.content, ti.created_at, IFNULL(u.nickname, 'Anonymous-somenone') nickname, IFNULL(u.profile_emoji,'🪐') profile_emoji
      from thread_index ti
      left join \`user\` u on u.user_id = ti.created_user_id
      where ti.thread_id = ?
      `;

    const result1 = await db.query<any>(query1, [thread_id]);
    res.status(200).json({ result: result1, error: null });

    //set thread_public view + 1 (not change modified_at)
    const query2 = `UPDATE thread_public SET \`view\`=\`view\` + 1, modified_at=modified_at WHERE thread_id=?;`;
    const result2 = await db.query<any[]>(query2, [thread_id]);
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
