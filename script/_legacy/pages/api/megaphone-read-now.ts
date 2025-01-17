import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import { CountryNameToLanguage, LanguageType, t } from "@/components/util/translate";
import CacheMap from "@/components/function-api/CacheMap";

export type MegaphoneResponseType = {
  created_user_id: number;
  thread_megaphone_id: number;
  thread_image: string | null;
  title: string | null;
  created_at: string | null;
  expired_at: string | null;
  isEvent: 0 | 1;
};

const cache = new CacheMap();
export const MegaphoneResponseTypeDefault = (language: LanguageType): MegaphoneResponseType => ({
  thread_image: null,
  title:
    t[
      "[무료 이벤트] 24시간마다 벌어지는 무료 확성기 이벤트!\n선착순 1명 확성기를 무료로 사용해보세요!\n\n[사용법]\n설정 -> 확성기 사용하기를 눌러주세요."
    ][language],
  created_at: null,
  expired_at: null,
  isEvent: 1,
  created_user_id: -1,
  thread_megaphone_id: -1,
});

// /megaphone-read-now
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //#region Check Cache Data
  const cacheKey = req.url;
  if (!cacheKey) return res.status(400).json({ result: null, error: "No Cache Key" });
  const cachedValue = cache.get(cacheKey);
  if (cachedValue !== null) return res.status(200).json({ result: cachedValue, error: null });
  //#endregion

  try {
    //#region params check
    const { language } = req.query;
    if (typeof language !== "string") return res.status(400).json({ result: null, error: "no params: language" });
    //#endregion

    //#region query excute
    //type=megaphone / tag=update
    const query1 = `select 
        created_user_id, thread_megaphone_id, 0 isEvent, 
        profile_emoji, content title, created_at, expired_at 
      from thread_megaphone
      where expired_at > NOW() and language = ? 
      order by expired_at limit 1;`;
    const result1 = await db.query<MegaphoneResponseType[]>(query1, language);
    const result = result1.length === 0 ? MegaphoneResponseTypeDefault(CountryNameToLanguage(language)) : result1[0];
    res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=60");
    res.status(200).json({ result: result, error: null });
    //#endregion

    // Save Cache Data
    cache.set(cacheKey, result, "second", 3);
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
