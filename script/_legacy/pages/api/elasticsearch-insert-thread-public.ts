import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import { esClient } from "./esClient";

const BATCH_SIZE = 100;

// 시작하기
// curl -GET "http://localhost:3000/api/elasticsearch-insert-thread-public"
// 211181 까지완료

// 마지막 번호 가져오기
/**
 curl -X GET "localhost:9200/thread_public/_search" -H "Authorization: ApiKey cnplWDg0c0Jrc05JRU0zUGhsNEY6aUc2dEdaXzBUc1NmSVlJU2dUVnp3Zw==" -H 'Content-Type: application/json' -d'
{
  "size": 1,
  "sort": [
    {
      "thread_id": "desc"
    }
  ]
}'

 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let defaultLastThreadId = 211181;
    // 오늘 날짜에 해당하는 가장 낮은 thread_id 가져오기
    const lastThreadQuery = `
      SELECT MIN(thread_id) AS min_thread_id
      FROM thread_public
      WHERE DATE(created_at) = CURDATE()
    `;

    const lastThreadResult = await db.query<{ min_thread_id: number }[]>(lastThreadQuery);
    let lastThreadId = lastThreadResult[0]?.min_thread_id || defaultLastThreadId;

    while (true) {
      console.info("start-lastThreadId", lastThreadId);

      const query = `SELECT * FROM thread_public 
        WHERE deleted_at IS NULL AND thread_id > ${lastThreadId}
        ORDER BY thread_id
        LIMIT ${BATCH_SIZE}
      `;

      const result: ThreadPublicRow[] = await db.query<ThreadPublicRow[]>(query);

      if (result.length === 0) break;

      const body = result.flatMap((doc) => {
        // tag 필드를 JSON 객체로 변환
        if (doc.tag && typeof doc.tag === "string") doc.tag = JSON.parse(doc.tag);
        if (doc.created_at) doc.created_at = new Date(doc.created_at).toISOString();
        if (doc.modified_at) doc.modified_at = new Date(doc.modified_at).toISOString();
        if (doc.deleted_at) doc.deleted_at = new Date(doc.deleted_at).toISOString();

        return [{ index: { _index: "thread_public", _id: doc.thread_id.toString() } }, doc];
      });

      await esClient
        .bulk({ refresh: true, body: body })
        .then((response) => {
          if (response.errors) {
            console.error("Bulk operation errors:");
            response.items.forEach((item: any) =>
              item.index && item.index.error ? console.error(item.index.error) : null
            );
          }
        })
        .catch(console.error);

      lastThreadId = result[result.length - 1].thread_id;
      console.info("lastThreadId", lastThreadId);
    }

    return res.status(200).json({ result: "Data indexed successfully", error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error: error });
  }
};

interface ThreadPublicRow {
  thread_id: number;
  last_index: number;
  profile_emoji: string | null;
  title: string | null;
  main_index: number | null;
  content: string;
  tag: string;
  created_user_id: number | null;
  view: number;
  person_like_count: number;
  person_dislike_count: number;
  comment_count: number;
  bookmark_count: number;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
}
