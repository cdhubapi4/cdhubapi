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
    const { thread_id } = req.query;
    if (typeof thread_id !== "string") return res.status(400).json({ result: null, error: "no query: thread_id" });

    //#endregion

    //#region query excute
    // set deleted_at
    const query = `UPDATE thread_public SET deleted_at = CURRENT_TIMESTAMP WHERE thread_id = ? and created_user_id = ?;`;
    const result = await db.query<any>(query, [thread_id, user_id]);
    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
