import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region query excute
    const query = `SELECT concat("archive?id=",tp.thread_id*183) url, tp.thread_id 
FROM thread_public tp
left join seo_naver_indexed nav on nav.thread_id = tp.thread_id
WHERE NOT (tp.tag LIKE '%취급주의%' OR tp.tag LIKE '%뉴스%') and nav.thread_id is null
ORDER BY tp.created_at DESC
LIMIT 50;
SELECT count(*) current_today
from seo_naver_indexed sni
WHERE DATE(created_at) = CURDATE();`;
    const result = await db.query<any>(query);

    return res
      .status(200)
      .json({ result: { list: result[0], current_today: result[1][0].current_today }, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
