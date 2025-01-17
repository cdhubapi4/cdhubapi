import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { nickname } = req.query;
    if (typeof nickname !== "string") return res.status(400).json({ result: null, error: "no params: nickname" });
    //#endregion

    //#region query excute
    const params = [nickname];
    const query = "SELECT count(nickname) > 0 is_nickname FROM user where deleted_at is null and nickname = ?;";
    const [result]: any = await db.query(query, params);

    res.status(200).json({ is_nickname: result.is_nickname, error: null });

    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
