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
    const { token, platform, browser, user_agent, location, onesignal_id } = req.body;
    if (!token) return res.status(400).json({ result: null, error: "Missing token in request body" });
    //#endregion

    //#region query execute
    const query = `
      INSERT INTO user_webpush_device 
      (user_id, token, platform, browser, user_agent, location, onesignal_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      user_id = VALUES(user_id), 
      platform = VALUES(platform), 
      browser = VALUES(browser), 
      user_agent = VALUES(user_agent), 
      location = VALUES(location), 
      onesignal_id = VALUES(onesignal_id),
      status = 'active';
    `;
    const result = await db.query(query, [user_id, token, platform, browser, user_agent, location, onesignal_id]);

    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
