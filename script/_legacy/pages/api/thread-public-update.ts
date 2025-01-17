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
    const {
      thread_id,
      tag,
      title,
      profile_emoji,
      last_index,
      main_index,
    }: {
      thread_id: number;
      tag: string[];
      title: string;
      profile_emoji: string;
      last_index: number;
      main_index: number;
    } = req.body;
    if (typeof thread_id !== "number") return res.status(400).json({ result: null, error: "no body: thread_id" });
    if (typeof tag !== "object") return res.status(400).json({ result: null, error: "no body: tag" });
    if (typeof title !== "string") return res.status(400).json({ result: null, error: "no body: title" });
    if (typeof main_index !== "number") return res.status(400).json({ result: null, error: "no body: main_index" });
    //#endregion

    //#region query excute
    // get message content
    const result2 = await db.query<{ content: string }[]>(
      `SELECT content FROM thread_index WHERE thread_id = ? and \`index\` = ?;`,
      [thread_id, main_index]
    );
    if (result2.length === 0)
      res.status(400).json({ result: null, error: "no content: need check thread_id and index" });
    const content = result2[0].content;

    // insert thread_public
    const tagStr = `json_array(${tag.map((t) => `"${t}"`).join(",")})`;
    const query1 = `INSERT INTO thread_public (thread_id, last_index, profile_emoji, title, main_index, content, tag, created_user_id) VALUES (?, ?, ?, ?, ?, ?, ${tagStr}, ?) 
    ON DUPLICATE KEY UPDATE last_index = ?, profile_emoji = ?, title = ?, main_index = ?, content = ?, tag = ${tagStr}, created_user_id = ?, deleted_at = null;`;
    // delete before-tag-list
    const query2 = `DELETE FROM thread_public_tag WHERE thread_id = ?;`;
    // insert tag-list
    const tagListStr = tag.map((t) => `(${thread_id}, '${t}')`).join(",");
    const query3 = `INSERT INTO thread_public_tag (thread_id, tag) VALUES ${tagListStr};`;

    const params = [
      ...[
        thread_id,
        last_index,
        profile_emoji,
        title,
        main_index,
        content,
        user_id,
        last_index,
        profile_emoji,
        title,
        main_index,
        content,
        user_id,
      ],
      ...[thread_id],
    ];
    const result1 = await db.query<any>(query1 + query2 + query3, params);
    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
