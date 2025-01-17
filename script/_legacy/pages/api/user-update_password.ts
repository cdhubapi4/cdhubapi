import { encrypt } from "@/components/util/Crypto";
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
    const { password } = req.query;
    if (typeof password !== "string") return res.status(400).json({ result: null, error: "no params: password" });
    //#endregion

    //#region query excute
    const params = [password, user_id];
    const query = `UPDATE user SET password=CONCAT('*', UPPER(SHA1(UNHEX(SHA1((?)))))) where user_id = ? and deleted_at is null;`;

    const result = await db.query(query, params);

    res.setHeader(
      "Set-Cookie",
      `key=${encrypt({ ...userData, isPassword: 1 } as object)}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );
    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
