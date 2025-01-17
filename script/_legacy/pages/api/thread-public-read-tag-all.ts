import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import CacheMap from "@/components/function-api/CacheMap";

const cache = new CacheMap();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //#region Check Cache Data
  const cacheKey = req.url;
  if (!cacheKey) return res.status(400).json({ result: null, error: "No Cache Key" });
  const cachedValue = cache.get(cacheKey);
  if (cachedValue !== null) return res.status(200).json({ result: cachedValue, error: null });
  //#endregion

  try {
    // 1. RETURN cached thread_public_tag_all
    const query1 = `SELECT tag, latest_modified_at, count FROM thread_public_tag_all_cache;`;
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
