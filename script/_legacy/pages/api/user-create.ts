import { encrypt } from "@/components/util/Crypto";
import { LanguageType } from "@/components/util/translate";
import sample from "lodash/sample";
import { NextApiRequest, NextApiResponse } from "next";
import uuid4 from "uuid4";
import { db } from "./db";
import { emojiList2 } from "./user-emoji";
import { UserDataType } from "@/components/util/getUserData";

export const LanguageList = ["KR"];

export type DefaultGeoLocationType = {
  IPv4: string; // "x.x.x.x";
  city: string; // "xx";
  country_code: string; // "XX";
  country_name: string; // "xxxx xxx";
  latitude: number; //xx.xxxx;
  longitude: number; //xxx.xxx;
  postal: string;
  state: string; // "xxxxx";
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { country, language, userAgent } = req.body as unknown as {
      country: DefaultGeoLocationType;
      language: LanguageType;
      userAgent: string | null;
    };
    if (!country) return res.status(400).json({ result: null, error: "no params: country" });
    if (!language) return res.status(400).json({ result: null, error: "no params: language" });
    //#endregion

    const settings = {
      dark_mode: 1,
      block_overseas_ip: 1,
      sent_letter: 1,
      block_new_letter: 0,
      refresh_auto: 1,
      language,
      country: country.country_name,
      country_ip: country.IPv4,
      country_city: country.city,
      country_latitude: country.latitude,
      country_longitude: country.longitude,
      country_postal: country.postal,
      country_state: country.state,
    };

    const nickname = `Anonymous-${uuid4().slice(0, 6)}`;
    const profile_emoji = sample(emojiList2);
    const params = [nickname, profile_emoji, JSON.stringify(settings), userAgent];
    const result1 = await db.query<any>(
      `INSERT INTO \`user\` (nickname, profile_emoji, settings, user_agent) VALUES(?, ?, ?, ?);`,
      params
    );
    const result2 = await db.query<any>(
      `SELECT created_at from user where user_id = ?;
      INSERT IGNORE INTO user_exp_data (user_id) VALUES (?);`,
      [result1.insertId, result1.insertId]
    );
    const user = {
      user_id: result1.insertId,
      nickname,
      profile_emoji,
      isPassword: 0,
      settings,
      created_at: result2[0][0].created_at,
      gender: "none",
      bio: null,
    } as UserDataType;
    res.status(200).json({ result: user, error: null });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
