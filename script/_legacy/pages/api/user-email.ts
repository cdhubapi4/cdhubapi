import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { email } = req.query;
    if (typeof email !== "string") return res.status(400).json({ result: null, error: "no params: email" });
    //#endregion

    //#region query excute
    const params = [email];
    const query = "INSERT IGNORE INTO user_email (email) VALUES(?);";
    const result: any = await db.query(query, params);
    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
