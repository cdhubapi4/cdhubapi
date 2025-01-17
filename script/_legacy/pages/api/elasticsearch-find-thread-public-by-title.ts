import { AggregationsAggregate, SearchResponse, Sort } from "@elastic/elasticsearch/lib/api/types";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import { esClient } from "./esClient";

// curl -GET "http://localhost:3000/api/elasticsearch-find-thread-public-by-title?query=제목&page=1&size=10&sort=created-desc"
export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { query, page, size, sort, createdType } = req.query;

  if (typeof query !== "string") return res.status(400).json({ result: null, error: "no params: query" });
  if (typeof page !== "string") return res.status(400).json({ result: null, error: "no params: page" });
  if (typeof size !== "string") return res.status(400).json({ result: null, error: "no params: size" });
  if (typeof sort !== "string") return res.status(400).json({ result: null, error: "no params: sort" });
  if (
    !["created-desc", "created-asc", "modified-asc", "modified-desc", "similarity", "view-desc", "like-desc"].includes(
      sort
    )
  )
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
  } else if (sort === "view-desc") {
    sortParams = { view: { order: "desc" } };
  } else if (sort === "like-desc") {
    sortParams = { person_like_count: { order: "desc" } };
  } else {
    const sortOrder: "asc" | "desc" = sort.includes("desc") ? "desc" : "asc";
    const sortField = sort.includes("created") ? "created_at" : "modified_at";
    sortParams = { [sortField]: { order: sortOrder } };
  }

  try {
    const response = await esClient.search<threadPublicResType>({
      index: "thread_public",
      body: {
        query: {
          bool: {
            must: query ? { match_phrase: { title: query } } : { match_all: {} },
            filter: dateRange ? { range: { modified_at: dateRange } } : undefined,
          },
        },
        from: (Number(page) - 1) * Number(size),
        size: Number(size),
        sort: sortParams,
        track_total_hits: true,
      },
    });

    return res.status(200).json({ result: response as threadPublicFindType, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

export type threadPublicFindType = SearchResponse<threadPublicResType, Record<string, AggregationsAggregate>>;

export type threadPublicResType = {
  thread_id: number; // 1298,
  last_index: number; //10,
  profile_emoji: string; //"🐕";
  title: string;
  main_index: number; //10,
  content: string;
  tag: string[]; //[ '취미', '창작소설' ],
  created_user_id: number; // 1016,
  view: number; //521,
  person_like_count: number; // 35,
  person_dislike_count: number; //0,
  comment_count: number; // 0,
  bookmark_count: number; //0,
  created_at: string; //"2023-07-24T15:17:06.000Z";
  modified_at: string; //"2023-07-27T16:39:33.000Z";
  deleted_at: string | null;
};
