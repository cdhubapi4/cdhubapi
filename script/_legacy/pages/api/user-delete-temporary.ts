import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region query excute
    // 내 아이피를 가진 유저삭제
    // DELETE FROM user WHERE user_id > 1479 AND JSON_EXTRACT(settings, '$.country_latitude') = 37.4979 AND JSON_EXTRACT(settings, '$.country_longitude') = 126.8592;
    // 비회원 삭제 쿼리 (매일 반복) -> 크롤링 USER LIST는 피해야함 + 비밀번호 없고 7일동안 활동 없는 유저 삭제
    const query = `
    DELETE FROM user
    WHERE 
        password IS NULL
        AND user_id NOT IN ( SELECT user_id FROM thread_private_person GROUP BY user_id )
        AND DATE_ADD(created_at, INTERVAL 7 DAY) < NOW()
        AND user_id > 1479;
    `;
    const result = await db.query(query);

    res.status(200).json({ result: true, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
