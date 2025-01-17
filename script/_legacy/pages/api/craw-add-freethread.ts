import saveThreadPublic, { Comment } from "@/components/function-api/saveThreadPublic";
import axios from "axios";
import { load } from "cheerio";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import { getRealUserId, userList } from "../../components/function-api/userList";
import { getToken } from "./craw-add-freethread-unlimit";
import { db } from "./db";

// curl -GET http://localhost:3000/api/craw-add-freethread?url=https://freethread.net/diary/187017
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region GET login session Cookie
    axios.defaults.headers.Cookie = await getToken();
    axios.defaults.withCredentials = true;
    if (!axios.defaults.headers.Cookie) return res.status(400).json({ result: null, error: "No Cookie" });
    //#endregion

    //#region params check
    const { url } = req.query;
    if (typeof url !== "string") return res.status(400).json({ result: null, error: "no params: url" });
    if (url.length > 511)
      return res.status(400).json({ result: null, error: "out params: out length url max length 511" });
    if (!url.includes("freethread.net"))
      return res.status(400).json({ result: null, error: "out params: domain freethread.net" });
    // #endregion

    // #region thread_url check
    const result2 = await db.query<{ thread_id: number; url: string }[]>(
      `SELECT thread_id, url FROM thread_url WHERE url = ?;`,
      [url]
    );
    // if (result2.length > 0) return res.status(400).json({ result: null, error: "out url: this url complete already." });
    let threadId = result2.length > 0 ? result2[0].thread_id : null;
    //#endregion

    //#region Crawling
    const pathParts = url.split("/");
    const forumId = pathParts.filter((t) => !t.includes(".net") && !t.includes("http") && !!t)[0];
    const threadNo = Number(pathParts.filter((t) => !t.includes(".net") && !t.includes("http") && !!t)[1]);

    const userIndices = new Map<string, number>();
    let currentUniqueId = 1;

    //#region get thread_public into ex. title, view, tag

    const body = await axios.get(url, { headers }).then((d) => d.data);
    const randomId = Math.floor(Math.random() * userList.length);

    const $ = load(body);
    const title = $("h3.title").text();

    const mainCommentIndex = "1";
    const tag = convertTag($("a.forum-title").text().replace("#", "").trim());
    let view = 0;

    if (!title || !tag) {
      console.error("craw-add-freethread : NO Title or Tag");
      return res.status(400).json({ result: null, error: "craw-add-freethread : NO Title or Tag" });
    }

    //#endregion

    //#region get Comment List

    let page = 0;
    const commentList: Comment[] = [];
    // getOptions(page, forumId, threadNo)
    while (true) {
      const data = (await axios
        .post(
          "https://freethread.net/api/reply/list",
          { forumId, threadNo, flag: "after", pointer: page * 25 },
          { headers }
        )
        .then((d) => {
          if (d.status === 204) return []; //last
          return d.data;
        })
        .catch((err) => {
          console.error("Request Failed:", err);
          return [];
        })) as Response;

      data.reverse().map((p, i) => {
        const nickname = p.identify;
        if (!userIndices.has(nickname)) userIndices.set(nickname, currentUniqueId++);
        const user = getRealUserId((userIndices.get(nickname) || 0) + randomId);

        /**
         * https://www.youtube.com/watch?v=2aN4D-IgBBg Youtube
         */
        const convertContent = (p: { contents: string; isDelete: number }) => {
          if (p.isDelete) return "삭제된 글 입니다.";
          if (p.contents.includes("ftd-ytube")) {
            const youtubeId = (p.contents.match(/idx="(.+?)"/) || [])[1] || "";
            return `https://www.youtube.com/watch?v=${youtubeId}`;
          }
          return p.contents
            .replace(
              /<ftd-anchor idx="(\d+)" offset="(\d+)"><\/ftd-anchor>\s?/g,
              (_, __, offset) => ">>" + offset + " "
            )
            .replace(/\r\n/g, "\n")
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&num;/g, "#")
            .replace(/<a href="(https:\/\/[^"]+)"[^>]*>[^<]*<\/a>/g, "$1")
            .replace(
              /<span class="msg dice"><span class="msg-title">(@dice[\d-]+)<\/span><span class="msg-contents">(\d+)<\/span><\/span>/g,
              "\n$1\n$2"
            )
            .trim();
        };

        const content = convertContent(p);

        commentList.push({
          createdAt: p.timestamp ? dayjs(p.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss") : null,
          index: commentList.length + 1,
          createdUserId: user.userId,
          createdUserEmoji: user.userEmoji,
          content,
        });
      });

      //check : is Last Comment ?
      if (data.length < 25) break;
      page++;
    }
    //#endregion

    //min-length 10
    if (commentList.length < 10) return res.status(400).json({ result: null, error: "min comment length is 10" });

    view = Math.floor(commentList.length * (10 + Math.random() * 20));
    threadId = await saveThreadPublic(commentList, threadId, [tag], title, mainCommentIndex, view, url);

    res.status(200).json({ result: threadId, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

type Response = {
  forumId: string; //'free',
  threadNo: number; //197316;
  offset: number; //11;
  replyIdx: number; //8139202;
  contents: string;
  // '<ftd-anchor idx="8138184" offset="8"></ftd-anchor> 고마워요 타래주! \r\n'+
  //     ' <ftd-anchor idx="8138936" offset="10"></ftd-anchor> 멋있는 마인드다..',
  name: string; //"";
  identify: string; //"9sHQg4cn";
  timestamp: number; // 1689219096;
  isAdmin: number; // 0;
  adminId: string; //"";
  isDelete: number; //0;
  ref: { src: number; dst: number }[];
}[];

const convertTag = (tag: string) => {
  switch (tag) {
    case "free":
      return "자유";
    case "chat":
      return "잡담";
    case "subculture":
      return "서브컬쳐";
    case "roleplay":
      return "상황극";
    case "study":
      return "공부";
    case "counsel":
      return "고민상담";
    case "game":
      return "게임";
    case "idol":
      return "아이돌";
    case "fear":
      return "공포미스테리";
    case "beauty":
      return "미용";
    case "infotech":
      return "IT";
    case "diary":
      return "일기";
    case "caution":
      return "취급주의";
  }
  return tag;
};
const headers = {
  Accept: "*/*",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
  "Cache-Control": "no-cache",
  "Content-Type": "application/json",
  Dnt: "1",
  Origin: "https://freethread.net",
  Pragma: "no-cache",
  "Sec-Ch-Ua": '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
};
