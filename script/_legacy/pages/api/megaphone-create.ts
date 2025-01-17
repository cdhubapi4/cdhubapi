import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    const {
      user_id,
      profile_emoji,
      settings: { language },
    } = userData;
    //#endregion

    //#region params check
    const { content } = req.body;
    if (typeof content !== "string") return res.status(400).json({ result: null, error: "no params: content" });
    //#endregion

    //#region query excute
    //#region new megaphone check
    const query1 =
      "SELECT TIMESTAMPDIFF(MINUTE, NOW(), expired_at) AS minute_diff, expired_at from thread_megaphone tm WHERE expired_at > NOW() order by created_at limit 1;";
    const result1 = await db.query<any>(query1);
    if (result1.length > 0) return res.status(200).json({ result: result1[0], error: null });
    //#endregion

    //#region new megaphone check
    //type=megaphone / tag=update
    const time = 60 * 24;
    const params2 = [content, user_id, profile_emoji, language];
    const query2 = `INSERT INTO thread_megaphone (
        content, created_user_id, profile_emoji, \`language\`, expired_at
      ) VALUES(
        ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ${time} MINUTE));`;
    // const query2 = `INSERT INTO thread_megaphone (\`type\`, tag, thread_image, created_user_id, title, expired_at, language) VALUES(?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ${time} MINUTE), ?);`;
    const result2 = await db.query<any>(query2, params2);
    res.status(200).json({ result: true, error: null });
    //#endregion
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
