import { Sort } from "@elastic/elasticsearch/lib/api/types";
import { NextApiRequest, NextApiResponse } from "next";
import { threadPublicFindType, threadPublicResType } from "./elasticsearch-find-thread-public-by-title";
import { esClient } from "./esClient";
import dayjs from "dayjs";

// curl -GET "http://localhost:3000/api/elasticsearch-find-thread-public-by-tag?query=취미&page=1&size=10&sort=created-desc"
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, page, size, sort, createdType } = req.query;

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
            must: { term: { tag: query } },
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
