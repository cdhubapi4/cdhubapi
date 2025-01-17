import { NextApiRequest, NextApiResponse } from "next";
import { esClient } from "./esClient";
import { SearchResponse, AggregationsAggregate, Sort } from "@elastic/elasticsearch/lib/api/types";
import dayjs from "dayjs";

// curl -GET "http://localhost:3000/api/elasticsearch-find-thread-index-by-content?page=1&size=10&sort=created-desc&query=펨"
export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { query, page, size, sort, createdType } = req.query;

  if (typeof query !== "string") return res.status(400).json({ result: null, error: "no params: query" });
  if (typeof page !== "string") return res.status(400).json({ result: null, error: "no params: page" });
  if (typeof size !== "string") return res.status(400).json({ result: null, error: "no params: size" });
  if (typeof sort !== "string") return res.status(400).json({ result: null, error: "no params: sort" });
  if (!["created-desc", "created-asc", "modified-asc", "modified-desc", "similarity"].includes(sort))
    return res.status(400).json({ result: null, error: "no type: sort" });

  let dateRange;
  const now = dayjs();
  switch (createdType) {
    case "day":
      dateRange = { gte: now.startOf("day").toISOString(), lte: now.endOf("day").toISOString() };
      break;
    case "week":
      dateRange = { gte: now.startOf("week").toISOString(), lte: now.endOf("week").toISOString() };
      break;
    case "month":
      dateRange = { gte: now.startOf("month").toISOString(), lte: now.endOf("month").toISOString() };
      break;
    case "year":
      dateRange = { gte: now.startOf("year").toISOString(), lte: now.endOf("year").toISOString() };
      break;
  }

  let sortParams: Sort | undefined;
  if (sort === "similarity") {
    sortParams = undefined;
  } else {
    const sortOrder: "asc" | "desc" = sort.includes("desc") ? "desc" : "asc";
    const sortField = sort.includes("created") ? "created_at" : "modified_at";
    sortParams = { [sortField]: { order: sortOrder } };
  }

  try {
    const response = await esClient.search<threadIndexResType>({
      index: "thread_index",
      body: {
        query: {
          bool: {
            must: { match_phrase: { content: query } },
            filter: dateRange ? { range: { modified_at: dateRange } } : undefined,
          },
        },
        from: (Number(page) - 1) * Number(size),
        size: Number(size),
        sort: sortParams,
        track_total_hits: true,
      },
    });

    return res.status(200).json({ result: response as threadIndexFindType, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

export type threadIndexFindType = SearchResponse<threadIndexResType, Record<string, AggregationsAggregate>>;

type threadIndexResType = {
  index_id: number; //11917490,
  thread_id: number; //206132,
  content: string; //'',
  type: null;
  created_user_id: number; //1092;
  index: number; //191;
  created_at: string; //"2023-11-02T08:30:30.000Z";
  modified_at: string; //"2023-11-02T08:30:30.000Z";
  deleted_at: string | null;
};
