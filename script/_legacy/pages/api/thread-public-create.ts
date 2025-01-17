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
    const {
      thread_id: thread_private_id,
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
    if (typeof thread_private_id !== "number")
      return res.status(400).json({ result: null, error: "no body: thread_id" });
    if (typeof tag !== "object") return res.status(400).json({ result: null, error: "no body: tag" });
    if (typeof title !== "string") return res.status(400).json({ result: null, error: "no body: title" });
    if (typeof main_index !== "number") return res.status(400).json({ result: null, error: "no body: main_index" });
    //#endregion

    //#region query excute
    // get message content
    const result2 = await db.query<{ content: string }[]>(
      `SELECT content FROM thread_private_index WHERE thread_private_id = ? and \`index\` = ?;`,
      [thread_private_id, main_index]
    );
    if (result2.length === 0)
      res.status(400).json({ result: null, error: "no content: need check thread_id and index" });
    const content = result2[0].content;

    // check thread_public_id already exist
    const result3 = await db.query<{ thread_public_id: number }[]>(
      `SELECT thread_public_id FROM thread_private_public_id WHERE thread_private_id = ?;`,
      [thread_private_id]
    );
    const thread_public_id = result3.length === 0 ? null : result3[0].thread_public_id;

    const tagStr = `json_array(${tag.map((t) => `"${t}"`).join(",")})`;

    // if not insert thread_public
    const query1 = thread_public_id
      ? `SET @thread_id = ${thread_public_id};`
      : `
      INSERT INTO thread (created_user_id, language) VALUES(?, ?);
      SET @thread_id = LAST_INSERT_ID();
    `;
    const parmas1 = thread_public_id ? [] : [user_id, language];

    // insert thread_index
    const query2 = `
    INSERT INTO thread_public (
        thread_id, last_index, profile_emoji, title,
        main_index, content, tag, created_user_id
      ) VALUES (
        @thread_id, ?, ?, ?,
        ?, ?, ${tagStr}, ?)
    ON DUPLICATE KEY UPDATE
      last_index = ?, profile_emoji = ?, title = ?, main_index = ?,
      content = ?, tag = ${tagStr}, created_user_id = ?, deleted_at = null;

    INSERT INTO thread_index (thread_id, content, created_user_id, \`index\`, created_at, modified_at, deleted_at)
      SELECT @thread_id, content, created_user_id, \`index\`, created_at, modified_at, deleted_at FROM thread_private_index
      WHERE thread_private_id = ?;
`;
    // delete before-tag-list
    const query3 = `DELETE FROM thread_public_tag WHERE thread_id = @thread_id;`;
    // insert tag-list
    const tagListStr = tag.map((t) => `(@thread_id, '${t}')`).join(",");
    const query4 = `INSERT INTO thread_public_tag (thread_id, tag) VALUES ${tagListStr};`;

    const params2 = [
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

      thread_private_id,
    ];
    const result1 = await db.query<any>(query1 + query2 + query3 + query4, [...parmas1, ...params2]);
    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
