import { encrypt } from "@/components/util/Crypto"; // decrypt 함수 임포트
import { DefaultGeoLocationType } from "@/pages/api/user-create";
import axios from "axios";
import { PRODUCTION_URL } from "./constant";
import { getUserDataByCookie } from "./getUserDataByCookie";

const getNewUser = async (userAgent: string | null) => {
  const protocol = process.env.PROTOCOL || "https";
  const country = await axios
    .get(`${protocol}://geolocation-db.com/json/`)
    .then((d) => d.data as DefaultGeoLocationType)
    .catch(() => null);
  const language = "KR";
  const newUserData = await axios
    .post<{ result: UserDataType | null }>(`${PRODUCTION_URL}/api/user-create`, { country, language, userAgent })
    .then((d) => d.data.result);

  return newUserData;
};

const getIsSEOBot = (userAgent: string | null) => {
  if (!userAgent) return false;
  const seoBotList = [
    "bingbot",
    "Googlebot",
    "Yeti",
    "kakaotalk",
    "Daum",
    "SemrushBot",
    "AdsBot",
    "facebook",
    "coccocbot",
    "Yandex",
    "DotBot",
    "Vercelbot",
    "DataForSeoBot",
    "applebot",
    "MJ12bot",
    "CensysInspect",
    "InternetMeasurement",
    "AhrefsBot",
    "google",
    "Nicecrawler",
    "QQBrowser",
    "wpbot",
    "BLEXBot",
    "AwarioBot",
  ];
  return seoBotList.some((botName) => userAgent.includes(botName));
};

/**
 * 쿠키 문자열에서 'key' 쿠키를 찾아 복호화된 값을 반환합니다.
 * @param cookieStr - 쿠키 문자열
 * @returns 복호화된 사용자 데이터 또는 임시 사용자 데이터
 */
export const getUserData = async (res: any, req: any) => {
  return null
  const cookie = req.headers.cookie || null;
  const userAgent = req.headers["user-agent"] || null;

  const isSEOBot = getIsSEOBot(userAgent);
  if (isSEOBot) {
    res.setHeader("Set-Cookie", `key=${encrypt(SEOuserData as object)}; Path=/; HttpOnly; Secure; SameSite=Strict`);
    return SEOuserData;
  }

  let userData = getUserDataByCookie(cookie);
  if (!userData) {
    userData = await getNewUser(userAgent);
    res.setHeader("Set-Cookie", `key=${encrypt(userData as object)}; Path=/; HttpOnly; Secure; SameSite=Strict`);
  }

  return userData;
};

const SEOuserData = {
  user_id: -1,
  nickname: "seo-bot",
  profile_emoji: "🚧",
  isPassword: 0,
  settings: {
    country: "bot",
    language: "KR",
    dark_mode: 1,
    country_ip: "",
    sent_letter: 1,
    country_city: "",
    refresh_auto: 1,
    country_state: "",
    country_postal: null,
    block_new_letter: 1,
    country_latitude: 0,
    block_overseas_ip: 1,
    country_longitude: 0,
  },
  created_at: "2024-01-01 00:00:00",
  gender: "none",
  bio: null,
} as UserDataType;

export type UserDataType = {
  user_id: number;
  gender: "female" | "male" | "none";
  bio: string | null;
  nickname: string | null;
  profile_emoji: string | null;
  settings: {
    country: string; //"South Korea";
    language: "KR" | "US" | "NONE"; //"KR";
    dark_mode: 0 | 1;
    country_ip: string; //"121.166.187.43";
    sent_letter: 0 | 1;
    country_city: string; //"Guro-gu";
    refresh_auto: 0 | 1;
    country_state: string; //"Seoul";
    country_postal: string | null;
    block_new_letter: 0 | 1;
    country_latitude: number; //37.4979;
    block_overseas_ip: 0 | 1;
    country_longitude: number; //126.8592;
  };
  created_at: string | null;
  isPassword: 1 | 0;
};
