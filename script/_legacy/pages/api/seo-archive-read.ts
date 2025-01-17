import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import CacheMap from "@/components/function-api/CacheMap";

export type ArchiveResponseType = {
  title: string;
  content: string;
  tag: string; //'['','']';
  created_at: string;
  is_deleted: 0 | 1;
  last_index: number;
};

const cache = new CacheMap();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //#region Check Cache Data
  const cacheKey = req.url;
  if (!cacheKey) return res.status(400).json({ result: null, error: "No Cache Key" });
  const cachedValue = cache.get(cacheKey);
  if (cachedValue !== null) return res.status(200).json({ result: cachedValue, error: null });
  //#endregion

  try {
    //#region params check
    const { id, no_message_list } = req.query;
    if (typeof id !== "string") return res.status(400).json({ result: null, error: "no params: id" });
    //#endregion

    //#region query excute
    //type=megaphone / tag=update
    const query1 =
      "SELECT title, last_index, content, tag, created_at, deleted_at is not null is_deleted FROM thread_public WHERE thread_id = ?;";
    const query2 = `-- hot
SELECT last_index, profile_emoji, main_index, thread_id, title, content, tag, created_user_id, \`view\`,	person_like_count, person_dislike_count, comment_count, modified_at, created_at 
FROM thread_public 
where deleted_at is null and thread_id = ?;`;
    const query3 =
      no_message_list === "true"
        ? `select ti.\`index\`, ti.index_id, ti.content, ti.created_at, u.nickname, u.profile_emoji
from thread_index ti
left join \`user\` u on u.user_id = ti.created_user_id 
where 1=0;`
        : `select ti.\`index\`, ti.index_id, ti.content, ti.created_at, u.nickname, u.profile_emoji
from thread_index ti
left join \`user\` u on u.user_id = ti.created_user_id 
where thread_id = ?
LIMIT 2;`;
    const params1 = [id, id, id];
    const result = await db.query(query1 + query2 + query3, params1);
    res.setHeader("Cache-Control", "public, s-maxage=1200, stale-while-revalidate=600");
    res.status(200).json({ result: result, error: null });
    //#endregion

    // Save Cache Data
    cache.set(cacheKey, result, "day", 100);
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
