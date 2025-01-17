import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { page, size } = req.query as {
      page: string;
      size: string;
    };
    if (typeof page !== "string") return res.status(400).json({ result: null, error: "no query: page" });
    if (typeof size !== "string") return res.status(400).json({ result: null, error: "no query: size" });
    //#endregion

    //#region query excute
    //type=megaphone / tag=update
    const query1 = `SELECT 
    TRIM(BOTH '"' FROM TRIM(BOTH '\\\'' FROM REGEXP_REPLACE(title, '\\\\[.*?\\\\]', ''))) AS title_regex,
    thread_id * 183 AS thread_id_mul,
    created_at
    FROM thread_public
    WHERE LENGTH(TRIM(BOTH '"' FROM TRIM(BOTH '\\\'' FROM REGEXP_REPLACE(title, '\\\\[.*?\\\\]', '')))) > 5
    LIMIT ${Number(size)} OFFSET ${Number(size) * Number(page)};`;
    const result1 = await db.query(query1);
    res.status(200).json({ result: result1 });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
