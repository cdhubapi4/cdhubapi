import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export type MegaphoneListType = {
  thread_megaphone_id: number;
  thread_image: string;
  title: string;
  created_at: string;
  expired_at: string;
}[];

// 확성기 사용내역
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    const { user_id } = userData;
    //#endregion

    //#region query excute
    // create new thread_index
    const getMegaphoneList = `
      SELECT thread_megaphone_id, profile_emoji thread_image, content title, created_at, expired_at
      FROM thread_megaphone
      WHERE created_user_id = ?`;
    // const getMegaphoneList = `select thread_id, thread_image, title, created_at, expired_at  from thread where type = 'megaphone' and tag = 'new' and created_user_id = ?`;
    const params1 = [user_id];
    const result1 = await db.query<MegaphoneListType>(getMegaphoneList, params1);

    res.status(200).json({ result: result1, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
