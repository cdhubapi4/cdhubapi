import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { title, desc, id: archive_id } = req.body;
    if (typeof archive_id !== "number") return res.status(400).json({ result: null, error: "no params: id" });
    if (typeof title !== "string") return res.status(400).json({ result: null, error: "no params: title" });
    if (typeof desc !== "string") return res.status(400).json({ result: null, error: "no params: desc" });
    //#endregion

    //#region query excute
    //type=megaphone / tag=update
    const query1 =
      "INSERT INTO archive (archive_id, title, content) SELECT ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM archive WHERE title = ?);";
    const params1 = [archive_id, title, desc, title];
    const result1 = await db.query(query1, params1);
    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
