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
    const { content, thread_id, last_index, created_user_id } = req.body;
    if (typeof last_index !== "number") return res.status(400).json({ result: null, error: "no body: last_index" });
    if (typeof content !== "string") return res.status(400).json({ result: null, error: "no body: content" });
    if (typeof thread_id !== "number") return res.status(400).json({ result: null, error: "no body: thread_id" });
    if (typeof created_user_id !== "number")
      return res.status(400).json({ result: null, error: "no body: created_user_id" });
    //#endregion

    //#region query excute
    const query = `
      -- thread main data update
      UPDATE thread_private
      SET last_send_user_id = ?, title = ?, last_index = last_index + 1
      WHERE thread_private_id = ?;
    
      -- thread letter data insert
      INSERT INTO thread_private_index (thread_private_id, content, created_user_id, \`index\`)
      VALUES (?, ?, ?, ?);

      -- letter person set
      INSERT INTO thread_private_person (thread_private_id, user_id)
      VALUES (?, ?);

      -- reply_count add
      SET @thread_private_new_id = (SELECT thread_private_new_id from thread_private WHERE thread_private_id = ?);
      UPDATE thread_private_new SET reply_count = reply_count + 1 WHERE thread_private_new_id = @thread_private_new_id;
    `;
    const result = await db.query(query, [
      user_id,
      content,
      thread_id,

      thread_id,
      content,
      user_id,
      2,

      thread_id,
      created_user_id,

      thread_id,
    ]);

    //#endregion

    // #region Send Web Push Notification
    axios.post(`${BASE_URL}/api/user-webpush-send-admin`, {
      content: profile_emoji + t["새 메세지가 도착했습니다."][language],
      user_id: created_user_id,
      key: "ad89y9fesy79aeofehth789",
    });
    //#endregion

    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
