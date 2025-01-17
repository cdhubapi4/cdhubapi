import { BASE_URL } from "@/components/util/constant";
import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { t } from "@/components/util/translate";
import axios from "axios";
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
    const { content, thread_megaphone_id, created_user_id, title } = req.query;
    if (typeof content !== "string") return res.status(400).json({ result: null, error: "no params: content" });
    if (typeof thread_megaphone_id !== "string")
      return res.status(400).json({ result: null, error: "no params: thread_megaphone_id" });
    if (typeof created_user_id !== "string")
      return res.status(400).json({ result: null, error: "no params: created_user_id" });
    if (typeof title !== "string") return res.status(400).json({ result: null, error: "no params: title" });
    //#endregion

    //#region query excute

    // 2. create new thread

    const query = `
      -- thread main data update
      INSERT INTO thread_private (created_user_id, last_send_user_id, last_index, title)
        VALUES(?, ?, 2, ?);
      SET @thread_private_id = LAST_INSERT_ID();
    
      -- thread letter data insert
      INSERT INTO thread_private_index (thread_private_id, content, created_user_id, \`index\`)
        VALUES (@thread_private_id, ?, ?, 1);
      INSERT INTO thread_private_index (thread_private_id, content, created_user_id, \`index\`)
        VALUES (@thread_private_id, ?, ?, 2);

      -- letter person set
      INSERT INTO thread_private_person (thread_private_id, user_id)
      VALUES (@thread_private_id, ?);
      INSERT INTO thread_private_person (thread_private_id, user_id)
      VALUES (@thread_private_id, ?);
    `;

    const result = await db.query<any>(query, [
      user_id,
      user_id,
      content,

      title,
      created_user_id,
      content,
      user_id,

      created_user_id,
      user_id,
    ]);

    res.status(200).json({ result: true, error: null });
    //#endregion

    //#region Send Web Push Notification
    await axios.post(`${BASE_URL}/api/user-webpush-send-admin`, {
      content: profile_emoji + t["새 메세지가 도착했습니다."][language],
      user_id: created_user_id,
      key: "ad89y9fesy79aeofehth789",
    });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
