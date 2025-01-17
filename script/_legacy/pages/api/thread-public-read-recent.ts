import CacheMap from "@/components/function-api/CacheMap";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

const cache = new CacheMap();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //#region Check Cache Data
  const cacheKey = req.url;
  if (!cacheKey) return res.status(400).json({ result: null, error: "No Cache Key" });
  const cachedValue = cache.get(cacheKey);
  if (cachedValue !== null) return res.status(200).json({ result: cachedValue, error: null });
  //#endregion

  try {
    //#region query excute
    const query1 = `
    select
      t1.last_index, t1.profile_emoji, t1.main_index, t1.thread_id, title,
      t1. content,
      t1.tag, t1.created_user_id, t1.view,
      t1.person_like_count, t1.person_dislike_count, t1.comment_count, 
      t1.modified_at, t1.created_at
    from (select tp.* from thread_public tp 
      left join thread_public_tag t on t.thread_id = tp.thread_id
      where t.tag != '취급주의'
      order by modified_at desc
      limit 20) t1
    group by t1.thread_id 
    limit 10
`;
    const result1 = await db.query<any>(query1);
    res.setHeader("Cache-Control", "public, s-maxage=1200, stale-while-revalidate=600");
    res.status(200).json({ result: result1, error: null });
    //#endregion

    // Save Cache Data
    cache.set(cacheKey, result1, "minute", 5);
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
