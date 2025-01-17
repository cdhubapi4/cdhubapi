import { getUserDataByCookie } from "@/components/util/getUserDataByCookie";
import { LanguageType, t } from "@/components/util/translate";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

// log 남기기 -> 사유, 누적 값
// 포인트 더하고 반영 쿼리
// 레벨업시 -> 반환에 추가 + 레벨 더하고 exp 뺴고 업데이트 + 레벨업 팝업 띄우기
// 레벨업 데이터 프론트에 남기기

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region user check
    const userData = getUserDataByCookie(req.headers.cookie);
    if (!userData) return res.status(400).json({ result: null, error: "authorization error: no userData" });
    const {
      user_id,
      isPassword,
      settings: { language },
    } = userData;
    //#endregion

    //#region params check
    const { type } = req.query as { type: RequestType };
    if (typeof type !== "string") return res.status(400).json({ result: null, error: "no params: type" });
    if (!typeList.includes(type)) return res.status(400).json({ result: null, error: "no type: type" });
    //#endregion

    //#region query excute

    // get data
    let expData = { level: 0, exp: 0 };
    let isFirst = false;
    let isFirstDay = false;

    // get expData / isFirst
    if (type === "signup") {
      const query1 = `SELECT level, \`exp\` from user where user_id = ?;`;
      const params1 = [user_id];
      const result1 = await db.query<[{ level: number; exp: number }]>(query1, params1);
      expData = result1[0];
    } else {
      const column = type + "_count";
      const query1 = `UPDATE user_exp_data SET ${column}=${column}+1 WHERE user_id = ?;
  SELECT ${column} value from user_exp_data WHERE user_id = ?;
  SELECT level, \`exp\` from user where user_id = ?;`;
      const params1 = [user_id, user_id, user_id];
      const result1 = await db.query<[[], [{ value: number }], [{ level: number; exp: number }]]>(query1, params1);
      const count = result1[1][0].value;
      isFirst = count === 1;
      expData = result1[2][0];
    }

    // get isFirstDay
    if (type === "visit" || type === "write_letter") {
      const query2 = `
    SELECT 
      CASE 
        WHEN DATE(created_at) = CURDATE() THEN 1
        ELSE 0
      END AS hasToday
    FROM user_exp_log uel 
    WHERE type = ? AND user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `;

      const params2 = [type, user_id];
      const result2 = await db.query<{ hasToday: number }[]>(query2, params2);

      isFirstDay = result2.length === 0 ? true : result2[0].hasToday !== 1;
    }

    const { title, message, earnedExp } = getEarnEXP(type, isFirst, isFirstDay, !!isPassword, language);

    // no modal
    if (!title) return res.status(200).json({ result: null, error: null });

    // //level up
    const beforeLevel = expData.level;
    const beforeExp = expData.exp;
    let max = getMaxExp(expData.level);
    let isLevelUp = false;
    expData.exp = expData.exp + earnedExp;
    while (expData.exp >= max) {
      expData.level = expData.level + 1;
      expData.exp = expData.exp - max;
      max = getMaxExp(expData.level);
      isLevelUp = true;
    }

    const query = `
    SET @userId = ?;
    SET @addExpValue = ?;
    SET @type = ?;
    SET @level = ?;
    SET @exp = ?;
    SET @previousTotalExp = (SELECT total_exp FROM user_exp_log WHERE user_id = @userId ORDER BY created_at DESC LIMIT 1);
    -- if total_exp is null -> 0
    SET @previousTotalExp = IFNULL(@previousTotalExp, 0);
    -- calc total_exp
    SET @newTotalExp = @previousTotalExp + @addExpValue;
    INSERT INTO user_exp_log (user_id, add_exp_value, type, \`level\`, \`exp\`, total_exp) VALUES (@userId, @addExpValue, @type, @level, @exp, @newTotalExp);
    UPDATE user set level = @level, exp = @exp where user_id = @userId;`;

    const result = await db.query(query, [user_id, earnedExp, type, expData.level, expData.exp]);

    const response: UserLevelAddExpResponse = {
      beforeLevel,
      currentLevel: expData.level,
      exp: expData.exp,
      max,
      isLevelUp,
      title: title,
      description: message,
      earnedExp: earnedExp,
      beforeExp: isLevelUp ? 0 : beforeExp,
    };
    res.status(200).json({ result: response, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

export type UserLevelAddExpResponse = {
  beforeLevel: number;
  currentLevel: number;
  exp: number;
  max: number;
  isLevelUp: boolean;
  title: string;
  description: string | null;
  earnedExp: number;
  beforeExp: number;
};

const getEarnEXP = (
  type: RequestType,
  isFirst: boolean,
  isFirstDay: boolean,
  isPassword: boolean | null,
  language: LanguageType
) => {
  let response: { earnedExp: number; message: null | string; title: null | string } = {
    earnedExp: 0,
    message: null,
    title: null,
  };

  //unsigned user check
  if (!isPassword) {
    if (type === "visit") {
      if (isFirst) response = { earnedExp: 0, message: t["visitFirst"][language], title: "첫 방문" };
    } else if (type === "signup") {
      response = { earnedExp: 100, message: t["signUp"][language], title: "회원가입" };
    }
    return response;
  }

  if (type === "visit") {
    if (isFirstDay) response = { earnedExp: 100, message: null, title: "매일 출석체크" };
  } else if (type === "write_letter") {
    if (isFirst) response = { earnedExp: 200, message: t["writeLetterFirst"][language], title: "첫 쪽지쓰기" };
    else if (isFirstDay) response = { earnedExp: 100, message: null, title: "매일 첫 쪽지쓰기" };
  } else if (type === "community_visit") {
    if (isFirst) response = { earnedExp: 200, message: t["communityVisitFirst"][language], title: "커뮤니티 첫 방문" };
  } else if (type === "dino_visit") {
    //Complete
    if (isFirst) response = { earnedExp: 200, message: t["dinoGameVisitFirst"][language], title: "Dino 게임 첫 방문" };
  } else if (type === "megaphone_use") {
    if (isFirst) response = { earnedExp: 200, message: t["megaphoneUseFirst"][language], title: "확성기 첫 사용" };
  } else if (type === "megaphone_reply") {
    if (isFirst) response = { earnedExp: 200, message: t["megaphoneReplyFirst"][language], title: "확성기 첫 답장" };
  } else if (type === "message_delete1") {
    if (isFirst) response = { earnedExp: 200, message: t["messageDelete1First"][language], title: "최초 쪽지 삭제 1" };
  } else if (type === "message_delete2") {
    if (isFirst) response = { earnedExp: 200, message: t["messageDelete2First"][language], title: "최초 쪽지 삭제 2" };
  } else if (type === "message_restore") {
    if (isFirst) response = { earnedExp: 200, message: t["messageRestoreFirst"][language], title: "최초 쪽지 복원" };
  } else if (type === "auto_refresh_use") {
    if (isFirst)
      response = { earnedExp: 300, message: t["autoRefreshUseFirst"][language], title: "최초 자동 새로고침" };
  } else if (type === "allow_noti") {
    if (isFirst) response = { earnedExp: 200, message: t["allowNotiFirst"][language], title: "최초 알림 허용" };
  }
  return response;
};

// "type" need "type_count" column
type RequestType =
  | "signup"
  | "visit"
  | "write_letter"
  | "community_visit"
  | "dino_visit"
  | "megaphone_use"
  | "megaphone_reply"
  | "message_delete1"
  | "message_delete2"
  | "message_restore"
  | "auto_refresh_use"
  | "allow_noti";
const typeList: RequestType[] = [
  "signup",
  "visit",
  "write_letter",
  "community_visit",
  "dino_visit",
  "megaphone_use",
  "megaphone_reply",
  "message_delete1",
  "message_delete2",
  "message_restore",
  "auto_refresh_use",
  "allow_noti",
];

export const getMaxExp = (level: number) => {
  if (level < 1) return 100;
  if (level === 1) return 100;
  if (level < 20) return 300 + 10 * (level - 1);
  if (level < 30) return 300 + 20 * (level - 1);
  if (level < 40) return 300 + 30 * (level - 1);
  if (level < 50) return 300 + 40 * (level - 1);
  if (level < 60) return 300 + 50 * (level - 1);
  if (level < 80) return 300 + 60 * (level - 1);
  if (level < 100) return 300 + 80 * (level - 1);
  return 10000000;
};
