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
    const query1 = `SELECT tag, COUNT(*) AS count
FROM (
   SELECT tpt.tag
   FROM \`thread_public_recent\` AS tpr
   JOIN \`thread_public_tag\` AS tpt ON tpr.thread_id = tpt.thread_id
   WHERE tpr.user_id = ?
) AS subquery
GROUP BY tag
ORDER BY \`count\` desc`;
    const result1 = await db.query<any>(query1, [user_id]);
    res.status(200).json({ result: result1, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
