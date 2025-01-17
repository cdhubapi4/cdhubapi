import { encrypt } from "@/components/util/Crypto";
import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    const { user_id, settings } = userData;
    //#endregion

    //#region params check
    // {"dark_mode": 1, "block_overseas_ip": 1, "sent_letter": 0, "block_new_letter": 0, "refresh_auto": 0}
    const { type, value } = req.query;
    if (typeof type !== "string") return res.status(400).json({ result: null, error: "no params: type" });
    if (typeof value !== "string") return res.status(400).json({ result: null, error: "no params: value" });
    if (
      !["refresh_auto", "dark_mode", "block_overseas_ip", "sent_letter", "block_new_letter", "language"].includes(type)
    )
      return res.status(400).json({ result: null, error: "invaild params: type not in valid list" });
    //#endregion

    //#region query excute
    const Value = type === "language" ? value : Number(value);
    const params = [Value, user_id];
    const query = `UPDATE user set settings = JSON_REPLACE(settings, '$.${type}', ?) where user_id = ? and deleted_at is null;`;
    const result = await db.query(query, params);

    res.setHeader(
      "Set-Cookie",
      `key=${encrypt({
        ...userData,
        settings: { ...settings, [type]: Value },
      } as object)}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );
    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
