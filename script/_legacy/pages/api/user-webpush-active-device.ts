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
    const { onesignal_id } = req.query;
    if (!onesignal_id) return res.status(400).json({ result: null, error: "Missing onesignal_id in request body" });
    //#endregion

    //#region query execute
    const query = `UPDATE user_webpush_device SET status = 'active' WHERE user_id = ? and onesignal_id = ?;`;
    const result = await db.query(query, [user_id, onesignal_id]);

    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
