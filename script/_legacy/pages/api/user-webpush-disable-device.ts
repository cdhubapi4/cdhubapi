import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { onesignal_id } = req.query;
    if (!onesignal_id) return res.status(400).json({ result: null, error: "Missing onesignal_id in request body" });
    //#endregion

    //#region query execute
    const query = `UPDATE user_webpush_device SET status = 'inactive' WHERE onesignal_id = ?;`;
    const result = await db.query(query, [onesignal_id]);

    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
