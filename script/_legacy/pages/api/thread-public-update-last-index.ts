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
    const {
      thread_id,
    }: {
      thread_id: number;
    } = req.body;
    if (typeof thread_id !== "number") return res.status(400).json({ result: null, error: "no body: thread_id" });
    //#endregion

    //#region query excute
    // update thread_public last_index
    const query1 = `UPDATE thread_public AS pub
    LEFT JOIN thread AS t ON pub.thread_id = t.thread_id
    SET pub.last_index = t.last_index
    WHERE pub.thread_id = ?;`;
    const query2 = `SELECT last_index FROM thread_public WHERE thread_id = ?;`;

    // update thread_index
    const query3 = `DELETE FROM thread_index WHERE thread_id = ?;`;
    const query4 = `INSERT IGNORE INTO thread_index (thread_id, content, created_user_id, \`index\`, created_at, modified_at, deleted_at)
SELECT thread_private_id, content, created_user_id, \`index\`, created_at, modified_at, deleted_at FROM thread_private_index
WHERE thread_private_id = ?;
`;

    const result1 = await db.query<any>(query1 + query2 + query3 + query4, [
      thread_id,
      thread_id,
      thread_id,
      thread_id,
    ]);
    res.status(200).json({ result: result1[1][0].last_index, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
