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
    const query1 = `-- hot
SELECT last_index, profile_emoji, main_index, thread_id, title, content, tag, created_user_id, \`view\`,    
    person_like_count, person_dislike_count, comment_count, modified_at, created_at
FROM thread_public FORCE INDEX (idx_thread_public_deleted_created)
WHERE deleted_at IS NULL
-- this month (7days ago)
AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
-- ORDER BY \`view\` DESC
ORDER BY \`person_like_count\` DESC
LIMIT 7;
`;
    const result1 = await db.query<any>(query1);
    res.setHeader("Cache-Control", "public, s-maxage=1200, stale-while-revalidate=600");
    res.status(200).json({ result: result1, error: null });
    //#endregion

    // Save Cache Data
    cache.set(cacheKey, result1, "day", 1);
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
