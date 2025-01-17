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
      settings: { language },
    } = userData;
    //#endregion

    //#region params check
    const { content } = req.body;
    if (typeof content !== "string") return res.status(400).json({ result: null, error: "no body: content" });
    //#endregion

    //#region query excute
    // delete, expired_at now for my letter

    const query1 = `
    UPDATE thread_private_new SET expired_at = NOW() WHEN created_user_id = ?;
    INSERT INTO 
      thread_private_new (
        content, created_user_id, \`language\`, expired_at
      ) VALUES(
        ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR));
      SET @last_thread_private_id = LAST_INSERT_ID();

      -- view user add
      INSERT INTO thread_private_new_person_view (thread_private_new_id, user_id) 
      VALUES (@last_thread_private_id, ?);`;
    const params1 = [user_id, content, user_id, language, user_id];
    const result1 = await db.query<any>(query1, params1);
    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
