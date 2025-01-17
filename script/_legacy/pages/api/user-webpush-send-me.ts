import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import axios from "axios";
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
    const { content } = req.body;
    if (!content) return res.status(400).json({ result: null, error: "Missing content in request body" });
    //#endregion

    //#region Send Push Notification
    const query = `SELECT * FROM user_webpush_device WHERE user_id = ? and status = 'active' ORDER BY created_at DESC LIMIT 5;`;
    const list = await db.query<WebPushDeviceType[]>(query, [user_id]);

    for (const data of list) await sendWebPush(data, content, String(user_id));

    //#endregion

    res.status(200).json({ result: true, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

export async function sendWebPush(data: WebPushDeviceType, content: string, user_id: string) {
  const { token, platform, browser, user_agent, location, onesignal_id, failed_count } = data;
  try {
    // OneSignal로 푸쉬 알림을 보내는 로직
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: "2ef1f0f8-f131-4881-a0a4-89b396897bec",
        include_player_ids: [onesignal_id],
        contents: { en: content },
        // 추가로 다른 옵션들도 포함 가능, 예: headings, subtitle, 이미지 등
      },
      { headers: { Authorization: `Basic MjE4Yzk0NDgtYmNmMC00ODNhLTg4MGYtNzRkYTU5NmE2MTFk` } }
    );

    if (response.data.errors) throw Error("Failed to send push notification");
    else {
      // 성공한 경우 DB에 성공했다고 기록
      await db.query(`UPDATE user_webpush_device SET failed_count = 0  and last_sent_at = NOW() WHERE token = ?;`, [
        token,
      ]);
    }
  } catch (pushError) {
    console.error(`Failed to send push to user_id:${user_id} token:${token}:`, pushError);
    if (failed_count >= 1) await db.query(`DELETE FROM user_webpush_device WHERE token = ?;`, [token]);
    else await db.query(`UPDATE user_webpush_device SET failed_count = failed_count + 1 WHERE token = ?;`, [token]);
  }
}

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
