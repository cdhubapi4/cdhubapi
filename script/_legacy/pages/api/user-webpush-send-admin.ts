import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import { sendWebPush } from "./user-webpush-send-me";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { key, content, user_id } = req.body;
    if (key !== "ad89y9fesy79aeofehth789")
      return res.status(400).json({ result: null, error: "no params: unknown key" });
    if (!content) return res.status(400).json({ result: null, error: "Missing content in request body" });
    if (!user_id) return res.status(400).json({ result: null, error: "Missing user_id in request body" });
    //#endregion

    //#region Send Push Notification
    const query = `SELECT * FROM user_webpush_device WHERE user_id = ? and status = 'active' ORDER BY created_at DESC LIMIT 5;`;
    const list = await db.query<WebPushDeviceType[]>(query, [user_id]);

    for (const data of list) await sendWebPush(data, content, user_id);

    //#endregion

    res.status(200).json({ result: true, error: null });
  } catch (error) {
    res.status(400).json({ result: null, error });
  }
};

type WebPushDeviceType = {
  device_id: number;
  user_id: number;
  token: string;
  platform: string;
  browser: string;
  status: string;
  user_agent: string;
  location: string;
  failed_count: number;
  onesignal_id: string;
};
