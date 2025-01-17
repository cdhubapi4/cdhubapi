import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// curl -GET http://localhost:3000/api/craw-add-freethread-unlimit?key=sfeskesfoisehfjo

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { key } = req.query;
    if (key !== "sfeskesfoisehfjo") return res.status(400).json({ result: null, error: "no params: unknown key" });
    //#endregion

    //#region GET login session Cookie
    axios.defaults.headers.Cookie = await getToken();
    axios.defaults.withCredentials = true;
    if (!axios.defaults.headers.Cookie) return res.status(400).json({ result: null, error: "No Cookie" });
    //#endregion

    //#region GET PAGE
    // COMPLETE to 3649/7132 page
    const maxPageList: number[] = new Array(forumList.length).fill(-1);
    for (let page = 0; page < 2; page++) {
      for (let forumType = 0; forumType < forumList.length; forumType++) {
        const category = forumList[forumType];

        if (category !== "caution") continue;

        // pass over max-page
        if (maxPageList[forumType] !== -1 && maxPageList[forumType] < page) continue;

        // get page list - 25 count
        const { data } = await axios.post<Response>(
          "https://freethread.net/api/forum/list",
          { forumId: category, page: page + 1, search: "" },
          { headers }
        );

        if (maxPageList[forumType] === -1) maxPageList[forumType] = data.totalPage;

        // set page data
        for (let i = 0; i < data.list.length; i++) {
          await axios
            .get(
              `http://localhost:3000/api/craw-add-freethread?url=https://freethread.net/${category}/${data.list[i].no}`
            )
            .catch(() => {});
          console.info(
            `[${page + 1}(${i + 1})/${maxPageList[forumType]}] https://freethread.net/${category}/${data.list[i].no}`,
            category,
            new Date().toISOString()
          );
        }

        // set inital max-page

        console.info(`[${page + 1}/${maxPageList[forumType]}]`, category, new Date().toISOString());
      }
    }
    //#endregion

    res.status(200).json({ result: true, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

const headers = {
  Accept: "*/*",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "ko-KR,ko;q=0.9",
  "Cache-Control": "no-cache",
  "Content-Type": "application/json",
  Cookie: "theme=dark; _ga=GA1.1.36330827.1692713526; _ga_Q8V39C0D83=GS1.1.1692713525.1.1.1692713529.0.0.0",
  Dnt: "1",
  Origin: "https://freethread.net",
  Pragma: "no-cache",
  Referer: "https://freethread.net/diary",
  "Sec-Ch-Ua": '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
};
const forumList = [
  "free",
  "chat",
  "subculture",
  "roleplay",
  "study",
  "counsel",
  "game",
  "idol",
  "fear",
  "beauty",
  "infotech",
  "diary",
  "caution",
];

type Response = {
  list: {
    no: number; //1747;
    replyCount: number; //2;
    title: string; //"111111";
    isNotice: number; // 0;
    renewAt: number; //1481385522;
    isClosed: boolean; //true;
  }[];
  totalPage: number;
};

export async function getToken() {
  const response = await axios.post("https://freethread.net/api/login", {
    email: "tkarnrwl78627862@gmail.com",
    pw: "tkarnr78^@",
  });

  if (axios.defaults.headers.Cookie) return axios.defaults.headers.Cookie;

  // Set-Cookie 값을 가져옵니다.
  const setCookieHeader = response.headers["set-cookie"];

  if (setCookieHeader) {
    const cookieValue = setCookieHeader.find((header) => header.startsWith("ft_sess="));
    if (cookieValue) {
      return cookieValue.split(";")[0]; // "ft_sess=a4ae89231d0c5e7c4e3141018dc0aa13d81cdfa435b29054df05eaadf426ed28"의 형태로 반환
    }
  }

  return null;
}
