import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    const { user_id } = userData;
    //#endregion

    //#region params check
    const { type } = req.query;
    if (typeof type !== "string") return res.status(400).json({ result: null, error: "no query: type" });
    if (!["bookmark", "like", "dislike"].includes(type))
      return res.status(400).json({ result: null, error: "no query: type" });
    //#endregion

    let table = "thread_public_bookmark";
    switch (type) {
      case "like":
        table = "thread_public_like";
        break;
      case "dislike":
        table = "thread_public_dislike";
        break;
      default:
        break;
    }

    //#region query excute
    const query1 = `
    select 
      tp.last_index, tp.profile_emoji, tp.main_index, tp.thread_id, 
      tp.title, tp.content, tp.tag, tp.created_user_id, 
      tp.\`view\`,	tp.person_like_count, tp.person_dislike_count, tp.comment_count, 
      tp.modified_at, tp.created_at
    from (select thread_id, created_at from ${table} tpb where user_id = ?) t
    left join thread_public tp on tp.thread_id = t.thread_id
    ORDER BY t.created_at desc
`;
    const result1 = await db.query<any>(query1, [user_id]);
    res.status(200).json({ result: result1, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
