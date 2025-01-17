import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { onesignal_id } = req.query;
    if (!onesignal_id) return res.status(400).json({ result: null, error: "Missing onesignal_id in request body" });
    //#endregion

    //#region query execute
    const query = `SELECT device_id FROM user_webpush_device WHERE onesignal_id = ? AND status = 'active';`;
    const result = await db.query<{ device_id: number }[]>(query, [onesignal_id]);

    res.status(200).json({ result: result.length > 0 ? result[0].device_id : null, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
