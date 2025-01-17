import { decrypt } from "@/components/util/Crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import CacheMap from "@/components/function-api/CacheMap";
import axios from "axios";
import { threadPublicFindType } from "./elasticsearch-find-thread-public-by-title";
import { threadIndexFindType } from "./elasticsearch-find-thread-index-by-content";
import { PRODUCTION_URL } from "@/components/util/constant";

export type sortType = "relevance" | "update" | "new" | "like" | "view";
export type createdType = "all" | "day" | "week" | "month" | "year";
export type dType = "title" | "letter" | "tag" | "user";
export const sortTypeList: sortType[] = ["relevance", "update", "new", "like", "view"];
export const createdTypeList: createdType[] = ["all", "day", "week", "month", "year"];
export const dTypeList: dType[] = ["title", "letter", "tag", "user"];

const cache = new CacheMap();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //#region Check Cache Data
  const cacheKey = req.url;
  if (!cacheKey) return res.status(400).json({ result: null, error: "No Cache Key" });
  const cachedValue = cache.get(cacheKey);
  if (cachedValue !== null) return res.status(200).json({ result: cachedValue, error: null });
  //#endregion

  try {
    //#region params check
    let { page, size, sort, created, d, query } = req.query as {
      page: string;
      size: string;
      sort: sortType;
      created: createdType;
      d: dType;
      query: string;
    };
    if (typeof page !== "string") return res.status(400).json({ result: null, error: "no query: page" });
    // if (typeof size !== "string") return res.status(400).json({ result: null, error: "no query: size" });
    if (!size) size = "10";
    if (!sort) sort = "relevance";
    if (!created) created = "all";
    if (!sortTypeList.includes(sort)) return res.status(400).json({ result: null, error: "no query: sort" });
    if (!createdTypeList.includes(created)) return res.status(400).json({ result: null, error: "no query: created" });
    if (!dTypeList.includes(d)) return res.status(400).json({ result: null, error: "no query: d" });
    //#endregion

    //#region query execute
    const roomList: SearchResponseType[] = [];
    let totalPage = 1;
    if (d === "title" || !query) {
      const params = getParams(query, page, size, sort, created);
      const res = await axios
        .get<{ result: threadPublicFindType }>(
          `${PRODUCTION_URL}/api/elasticsearch-find-thread-public-by-title?${params}`
        )
        .then((d) => d.data.result);

      // 마지막 페이지 계산
      const totalItems = typeof res.hits.total === "number" ? res.hits.total : res.hits.total?.value;
      totalPage = totalItems ? Math.ceil(totalItems / Number(size)) : 1;

      res.hits.hits.map((i) => {
        if (!i._source) return;
        const data = {
          last_index: i._source.last_index,
          profile_emoji: i._source.profile_emoji,
          main_index: i._source.main_index,
          thread_id: i._source.thread_id,
          title: i._source.title,
          content: i._source.content,
          tag: i._source.tag,
          created_user_id: i._source.created_user_id,
          person_like_count: i._source.person_like_count,
          person_dislike_count: i._source.person_dislike_count,
          comment_count: i._source.comment_count,
          modified_at: i._source.modified_at,
          created_at: i._source.created_at,
          view: i._source.view,
        };
        roomList.push(data);
      });
    } else if (d === "letter") {
      const params = getParams(query, page, size, sort, created);
      const res = await axios
        .get<{ result: threadIndexFindType }>(
          `${PRODUCTION_URL}/api/elasticsearch-find-thread-index-by-content?${params}`
        )
        .then((d) => d.data.result);

      // 마지막 페이지 계산
      const totalItems = typeof res.hits.total === "number" ? res.hits.total : res.hits.total?.value;
      totalPage = totalItems ? Math.ceil(totalItems / Number(size)) : 1;

      if (totalItems && totalItems > 0) {
        // Elasticsearch 검색 결과 처리
        const threadIds = res.hits.hits.map((hit) => (hit && hit._source ? hit._source.thread_id : null));
        // DB 쿼리 준비
        const placeholders = threadIds.map(() => "?").join(", ");
        const q = `
          SELECT thread_id, last_index, profile_emoji, main_index, title, tag, person_like_count, person_dislike_count, comment_count, view
          FROM thread_public
          WHERE thread_id IN (${placeholders})
        `;
        // DB 쿼리 실행
        const dbResult = await db.query<
          {
            thread_id: number;
            last_index: number;
            profile_emoji: string;
            main_index: number;
            title: string;
            tag: string;
            person_like_count: number;
            person_dislike_count: number;
            comment_count: number;
            view: number;
          }[]
        >(q, threadIds);

        // Elasticsearch 결과와 DB 결과 결합
        res.hits.hits.map((i) => {
          if (!i._source) return;
          const threadId = i._source.thread_id;
          const additionalData = dbResult.find((row) => row.thread_id === threadId);
          if (!additionalData) return;
          const data = {
            ...i._source,
            ...additionalData,
            tag: additionalData.tag ? JSON.parse(additionalData.tag) : null,
          };
          roomList.push(data);
        });
      }
    } else if (d === "tag") {
      const params = getParams(query, page, size, sort, created);

      const res = await axios
        .get<{ result: threadPublicFindType }>(
          `${PRODUCTION_URL}/api/elasticsearch-find-thread-public-by-tag?${params}`
        )
        .then((d) => d.data.result);

      // 마지막 페이지 계산
      const totalItems = typeof res.hits.total === "number" ? res.hits.total : res.hits.total?.value;
      totalPage = totalItems ? Math.ceil(totalItems / Number(size)) : 1;

      res.hits.hits.map((i) => {
        if (!i._source) return;
        const data = {
          last_index: i._source.last_index,
          profile_emoji: i._source.profile_emoji,
          main_index: i._source.main_index,
          thread_id: i._source.thread_id,
          title: i._source.title,
          content: i._source.content,
          tag: i._source.tag,
          created_user_id: i._source.created_user_id,
          person_like_count: i._source.person_like_count,
          person_dislike_count: i._source.person_dislike_count,
          comment_count: i._source.comment_count,
          modified_at: i._source.modified_at,
          created_at: i._source.created_at,
          view: i._source.view,
        };
        roomList.push(data);
      });
    } else if (d === "user") {
      const pageQuery = `LIMIT ${parseInt(size)} OFFSET ${(parseInt(page) - 1) * parseInt(size)}`;
      let filterQuery = ``;
      if (created === "day")
        filterQuery = "AND tp.created_at BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 1 SECOND";
      else if (created === "week")
        filterQuery =
          "AND tp.created_at BETWEEN DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY) AND DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) - 6 DAY)";
      else if (created === "month")
        filterQuery = "AND tp.created_at BETWEEN DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AND LAST_DAY(CURRENT_DATE)";
      else if (created === "year")
        filterQuery =
          "AND tp.created_at BETWEEN DATE_FORMAT(CURRENT_DATE, '%Y-01-01') AND DATE_FORMAT(CURRENT_DATE, '%Y-12-31')";

      // 총 게시물 수를 구하는 쿼리
      const countQuery = `
        SELECT COUNT(tp.thread_id) AS total_count
        FROM thread_public AS tp
        INNER JOIN user AS u ON tp.created_user_id = u.user_id
        WHERE u.nickname = ?;
      `;

      // 데이터를 조회하는 쿼리
      const dataQuery = `
        SELECT tp.last_index, tp.profile_emoji, tp.main_index, tp.thread_id,
              tp.title, tp.content, tp.tag, tp.created_user_id,
              tp.view, tp.person_like_count, tp.person_dislike_count, 
              tp.comment_count, tp.modified_at, tp.created_at
        FROM thread_public AS tp
        INNER JOIN user AS u ON tp.created_user_id = u.user_id
        WHERE u.nickname = ? ${filterQuery}
        ${getsortQuery(sort)}
        ${pageQuery};
      `;

      // DB 쿼리 실행
      const [totalCountResult, dataResult] = await db.query<
        [
          { total_count: number }[],
          {
            thread_id: number;
            last_index: number;
            profile_emoji: string;
            main_index: number;
            title: string;
            content: string;
            tag: string;
            created_user_id: number;
            person_like_count: number;
            person_dislike_count: number;
            comment_count: number;
            view: number;
            modified_at: string;
            created_at: string;
          }[],
        ]
      >(`${countQuery}; ${dataQuery}`, [query, query]);

      // 총 게시물 수 추출 및 마지막 페이지 계산
      const totalItems = totalCountResult[0].total_count;
      totalPage = Math.ceil(totalItems / parseInt(size));

      // 결과 데이터 처리
      dataResult.map((i) => {
        const data = {
          last_index: i.last_index,
          profile_emoji: i.profile_emoji,
          main_index: i.main_index,
          thread_id: i.thread_id,
          title: i.title,
          content: i.content,
          tag: i.tag ? JSON.parse(i.tag) : null,
          created_user_id: i.created_user_id,
          person_like_count: i.person_like_count,
          person_dislike_count: i.person_dislike_count,
          comment_count: i.comment_count,
          modified_at: i.modified_at,
          created_at: i.created_at,
          view: i.view,
        };
        roomList.push(data);
      });
    }
    //#endregion

    res.setHeader("Cache-Control", "public, s-maxage=1200, stale-while-revalidate=600");
    res.status(200).json({ result: { roomList, totalPage }, error: null });
    //#endregion

    // Save Cache Data
    cache.set(cacheKey, roomList, "day", 7);
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

export type SearchResponseType = {
  last_index: number | undefined;
  profile_emoji: string;
  main_index: number;
  thread_id: number;
  title: string;
  content: string;
  tag: string[];
  created_user_id: number;
  person_like_count: number;
  person_dislike_count: number;
  comment_count: number;
  modified_at: string;
  created_at: string;
  view: number;
};

const getParams = (query: string, page: string, size: string, sort: sortType, created: string) => {
  const getSort = (sort: sortType) => {
    switch (sort) {
      case "relevance":
        return "similarity";
      case "update":
        return "modified-desc";
      case "new":
        return "created-desc";
      case "like":
        return "like-desc";
      case "view":
        return "view-desc";
    }
  };
  return `query=${query}&page=${page}&size=${size}&sort=${getSort(sort)}&createdType=${created}`;
};

const getsortQuery = (sort: sortType) => {
  switch (sort) {
    case "new":
      return " ORDER BY tp.created_at DESC";
    case "update":
      return " ORDER BY tp.modified_at DESC";
    case "like":
      return " ORDER BY tp.person_like_count DESC";
    case "view":
      return " ORDER BY tp.view DESC";
    default:
      return "";
  }
};
