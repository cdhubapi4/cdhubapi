import saveThreadPublic, { Comment } from "@/components/function-api/saveThreadPublic";
import { load } from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";

import { db } from "./db";
import { userList, getRealUserId } from "@/components/function-api/userList";
import axios from "axios";

// curl -GET http://localhost:3000/api/craw-add-thredic?url=https://thredic.com/index.php?document_srl=71578823
const getTagList = (tag: string): string[] => {
  const data: { [key: string]: string } = {
    바보: "놀이",
    앵커: "놀이",
    난장판: "놀이",
    심리: "놀이",
    꿈: "놀이",
    잡담: "사회",
    고민상담: "사회",
    뒷담화: "사회",
    연애: "사회",
    퀴어: "사회",
    공부: "사회",
    동인: "취미",
    창작소설: "취미",
    연예인: "취미",
    미디어: "취미",
    취향: "취미",
    미용: "취미",
  };
  const category = data[tag];
  if (category) return [category, tag];
  return [tag];
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check

    const { url } = req.query;

    if (typeof url !== "string") return res.status(400).json({ result: null, error: "no params: url" });
    if (url.length > 511)
      return res.status(400).json({ result: null, error: "out params: out length url max length 511" });
    if (!url.includes("thredic.com"))
      return res.status(400).json({ result: null, error: "out params: domain thredic.com" });
    //#endregion

    // #region thread_url check
    const result2 = await db.query<{ thread_id: number; url: string }[]>(
      `SELECT thread_id, url FROM thread_url WHERE url = ?;`,
      [url]
    );
    // if (result2.length > 0) return res.status(400).json({ result: null, error: "out url: this url complete already." });
    let threadId = result2.length > 0 ? result2[0].thread_id : null;
    //#endregion

    //#region Crawling
    const response = await axios.get(url + "&comment=all");
    const body = response.data;
    const randomId = Math.floor(Math.random() * userList.length);

    const $ = load(body);

    const commentList: Comment[] = [];
    const userIndices = new Map<string, number>();
    let currentUniqueId = 1;
    const title = ($("div.thread_title > a > h1").text() || $("div.thread_title > a > h2").text()).trim();
    const mainCommentIndex = $("div.thread_title > a > span.comment").text().trim();
    const tag = $("div.board_read > div.lnb > a").text().trim();
    const view = $("div.all_read span.hit").text().replace("Hit", "").trim();

    let isBreak = false;
    $("div.thredic_res").each((_, element) => {
      const $element = $(element);
      const nickname = $element.find("span.user_name").text().trim();
      const index = commentList.length + 1;
      const createdAt = $element.find("span.time").text().trim();
      const commentText = $element.find(".thredic_content").text().trim();
      // nickname에 대한 고유 번호 할당
      if (!userIndices.has(nickname)) userIndices.set(nickname, currentUniqueId++);
      const user = getRealUserId((userIndices.get(nickname) || 0) + randomId);

      // if (commentText.includes("thredic") || commentText.includes("스레딕")) isBreak = true;

      commentList.push({
        index,
        createdAt,
        createdUserId: user.userId,
        createdUserEmoji: user.userEmoji,
        content: commentText,
      });
    });
    //#endregion

    //min-length 10
    if (commentList.length < 10) return res.status(400).json({ result: null, error: "min comment length is 10" });
    // block-word check
    if (isBreak) return res.status(400).json({ result: null, error: "block word true" });

    threadId = await saveThreadPublic(
      commentList,
      threadId,
      getTagList(tag),
      title,
      mainCommentIndex,
      parseInt(view),
      url
    );

    res.status(200).json({ result: threadId, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
