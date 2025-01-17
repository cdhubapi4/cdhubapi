import { encrypt } from "@/components/util/Crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { nickname, password } = req.query;
    if (typeof nickname !== "string") return res.status(400).json({ result: null, error: "no params: nickname" });
    if (typeof password !== "string") return res.status(400).json({ result: null, error: "no params: password" });
    //#endregion

    //#region query excute
    const params = [password, nickname];
    const query = `SELECT u.user_id, u.gender, u.bio, u.nickname, u.profile_emoji, IF(u.password is null, 0, 1) isPassword, u.settings, u.created_at
        from user u
        where password = CONCAT('*', UPPER(SHA1(UNHEX(SHA1((?))))))
          and nickname = ?
          and deleted_at is null;`;
    const result: any = await db.query(query, params);

    if (result.length === 0) return res.status(200).json({ result: null, error: "no user" });

    const user = { ...result[0], settings: JSON.parse(result[0].settings) };
    res.setHeader("Set-Cookie", `key=${encrypt(user as object)}; Path=/; HttpOnly; Secure; SameSite=Strict`);
    res.status(200).json({ result: user, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
