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
    const { thread_id }: { thread_id: number } = req.body;
    if (typeof thread_id !== "number") return res.status(400).json({ result: null, error: "no body: thread_id" });
    //#endregion

    //#region query excute
    // insert
    const query1 = `INSERT INTO \`thread_public_recent\` (\`user_id\`, \`thread_id\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`modified_at\` = CURRENT_TIMESTAMP;`;
    const result1 = await db.query<any>(query1, [user_id, thread_id]);
    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
