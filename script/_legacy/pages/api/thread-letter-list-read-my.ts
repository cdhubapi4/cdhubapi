import CacheMap from "@/components/function-api/CacheMap";
import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

const cache = new CacheMap();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    const {
      user_id,
      settings: { sent_letter, block_new_letter, language },
    } = userData;
    //#endregion

    //#region Check Cache Data
    const cacheKey = req.url + JSON.stringify(req.query) + JSON.stringify(req.body) + user_id;
    if (!cacheKey) return res.status(400).json({ result: null, error: "No Cache Key" });
    const cachedValue = cache.get(cacheKey);
    if (cachedValue !== null) return res.status(200).json({ result: cachedValue, error: null });
    //#endregion

    //#region query excute
    //쪽지 삭제/차단 = 쪽지 thread_private_person 삭제
    if (block_new_letter === 0) {
      const getNewLetter = `
        SELECT 
          n.thread_private_new_id,
          n.created_user_id,
          n.content
        FROM thread_private_new n
        LEFT JOIN thread_private_new_person_view np 
          ON np.thread_private_new_id = n.thread_private_new_id AND np.user_id = ?
        LEFT JOIN user u on u.user_id = n.created_user_id
        LEFT JOIN user_block ub 
          ON (ub.user_id = ? AND ub.target_user_id = n.created_user_id) 
          OR (ub.user_id = ? AND ub.target_user_ip = JSON_UNQUOTE(JSON_EXTRACT(u.settings, '$.country_ip')))
        WHERE n.deleted_at IS NULL AND n.expired_at > NOW() 
          AND n.\`language\` = ? AND np.user_id IS NULL
          AND n.reply_count < 5
          AND u.user_id is not null
          AND ub.target_user_id IS NULL
        order by n.created_at desc
        limit 1;`;
      const getNewLetterParams = [user_id, user_id, user_id, language];
      const newLetterData = await db.query<
        { thread_private_new_id: number; created_user_id: number; content: string }[]
      >(getNewLetter, getNewLetterParams);

      /**
       * -- letter person set
          INSERT INTO thread_private_person (thread_private_id, user_id)
          VALUES (@last_thread_private_id, ?); 에서 답장할때 쪽지 생성자 creator_user_id 넣어줘야함.
       */
      if (newLetterData.length > 0) {
        const { thread_private_new_id, created_user_id, content } = newLetterData[0];
        const insertNewLetterQuery = `
          -- thread main data insert
          INSERT INTO thread_private (thread_private_new_id, created_user_id, last_send_user_id, last_index, title)
          VALUES (?, ?, ?, 1, ?);
          SET @last_thread_private_id = LAST_INSERT_ID();
          
          -- thread letter data insert
          INSERT INTO thread_private_index (thread_private_id, content, created_user_id, \`index\`)
          VALUES (@last_thread_private_id, ?, ?, 1);
          
          -- letter person set
          INSERT IGNORE INTO thread_private_person (thread_private_id, user_id)
          VALUES (@last_thread_private_id, ?);
          
          -- view user add
          INSERT INTO thread_private_new_person_view (thread_private_new_id, user_id) 
          VALUES (?, ?);

          -- check max user response
          SET @user_count = (
            SELECT COUNT(user_id) FROM thread_private_new_person_view WHERE thread_private_new_id = ?
          );
          UPDATE thread_private_new
          SET expired_at = CASE WHEN @user_count >= 100 THEN NOW() ELSE expired_at END
          WHERE thread_private_new_id = ?;
        `;
        const insertNewLetterQueryParams = [
          thread_private_new_id,
          created_user_id,
          created_user_id,
          content,

          content,
          created_user_id,

          user_id,

          thread_private_new_id,
          user_id,
          thread_private_new_id,
          thread_private_new_id,
        ];
        const result1 = await db.query<any[]>(insertNewLetterQuery, insertNewLetterQueryParams);
      }
    }
    const query2 = `
      select
        t.thread_private_id thread_id, t.created_user_id, t.title,
        IFNULL(u2.nickname, IFNULL(u.nickname, "Deleted User")) AS nickname,
	      IFNULL(u2.profile_emoji, IFNULL(u.profile_emoji, "❔")) AS profile_emoji,
	      IFNULL(u2.user_id, u.user_id) AS other_user_id,
        t.modified_at, t.created_at, t.last_send_user_id,
        t.last_index
      FROM  thread_private_person p
      left join thread_private t on t.thread_private_id = p.thread_private_id
      left join \`user\` u on u.user_id = t.last_send_user_id
      LEFT JOIN thread_private_person tpp ON tpp.thread_private_id = t.thread_private_id AND tpp.user_id != ?
      LEFT JOIN user u2 ON u2.user_id = tpp.user_id
      WHERE p.user_id = ? and t.deleted_at is null ${sent_letter === 0 ? `and t.last_send_user_id != ${user_id}` : ""}
       and t.title is not null
      order by t.modified_at desc;`;
    const params2 = [user_id, user_id];

    const result = await db.query<any[]>(query2, params2);

    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=3");
    res.status(200).json({ result, error: null });
    //#endregion

    // Save Cache Data
    cache.set(cacheKey, result, "second", 3);
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
