import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db"; // 데이터베이스 연결 설정을 가정합니다.
import { esClient } from "./esClient";

const BATCH_SIZE = 1000;

// curl -GET "http://localhost:3000/api/elasticsearch-insert-thread-index"
// 13100175 까지완료

// 마지막 번호 가져오기
/**
 curl -X GET "localhost:9200/thread_index/_search" -H "Authorization: ApiKey cnplWDg0c0Jrc05JRU0zUGhsNEY6aUc2dEdaXzBUc1NmSVlJU2dUVnp3Zw==" -H 'Content-Type: application/json' -d'
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
    let defaultLastIndexId = 13100175;
    // 오늘 날짜에 해당하는 가장 낮은 index_id 가져오기
    const lastIndexQuery = `
     SELECT MIN(index_id) AS min_index_id
    FROM thread_index
    WHERE index_id > ${defaultLastIndexId} and DATE(created_at) = CURDATE()
  `;

    const lastIndexResult = await db.query<{ min_index_id: number }[]>(lastIndexQuery);
    let lastIndexId = lastIndexResult[0].min_index_id || defaultLastIndexId; // 기본값 설정

    while (true) {
      console.info("start-lastIndexId", lastIndexId);

      const query = `SELECT * FROM thread_index 
            WHERE deleted_at IS NULL AND index_id > ${lastIndexId}
            ORDER BY index_id
            LIMIT ${BATCH_SIZE}
          `;
      const result: ThreadIndexRow[] = await db.query<ThreadIndexRow[]>(query);

      if (result.length === 0) break;

      const body = result.flatMap((doc) => {
        if (doc.created_at) doc.created_at = new Date(doc.created_at).toISOString();
        if (doc.modified_at) doc.modified_at = new Date(doc.modified_at).toISOString();
        return [{ index: { _index: "thread_index", _id: doc.index_id.toString() } }, doc];
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

      lastIndexId = result[result.length - 1].index_id;
      console.info("lastIndexId", lastIndexId);
    }

    return res.status(200).json({ result: "Data indexed successfully", error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error: error });
  }
};

interface ThreadIndexRow {
  index_id: number;
  thread_id: number;
  content: string;
  type: string | null;
  created_user_id: number;
  index: number;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
}
