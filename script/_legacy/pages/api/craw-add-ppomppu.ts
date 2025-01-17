import saveThreadPublic, { Comment } from "@/components/function-api/saveThreadPublic";
import { Cheerio, Element, load } from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import { userList, getRealUserId } from "@/components/function-api/userList";
import axios from "axios";
import iconv from "iconv-lite";
import dayjs from "dayjs";

// https://www.ppomppu.co.kr/zboard/view.php?id=baseball&no=657299
// curl -GET http://localhost:3000/api/craw-add-ppomppu?url=https%3A%2F%2Fwww.ppomppu.co.kr%2Fzboard%2Fview.php%3Fid%3Dbaseball%26no%3D657299
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    let { url } = req.query;
    if (typeof url !== "string") return res.status(400).json({ result: null, error: "no params: url" });
    if (url.length > 511)
      return res.status(400).json({ result: null, error: "out params: out length url max length 511" });
    if (!url.includes("ppomppu.co.kr"))
      return res.status(400).json({ result: null, error: "out params: domain ppomppu.co.kr" });
    //#endregion

    // redirect
    url = url.replace("zboard.php", "view.php").trim();

    // #region thread_url check
    const result2 = await db.query<{ thread_id: number; url: string }[]>(
      `SELECT thread_id, url FROM thread_url WHERE url = ?;`,
      [url]
    );
    // if (result2.length > 0) return res.status(400).json({ result: null, error: "out url: this url complete already." });

    let threadId = result2.length > 0 ? result2[0].thread_id : null;
    //#endregion

    //#region Crawling
    const body = await axios
      .get(url, {
        responseType: "arraybuffer",
        transformResponse: [(data) => iconv.decode(Buffer.from(data), "EUC-KR")],
      })
      .then((d) => d.data);
    const randomId = Math.floor(Math.random() * userList.length);
    const $ = load(body);
    const commentList: Comment[] = [];
    const userIndices = new Map<string, number>();
    let currentUniqueId = 1;

    const titleElement = $(".view_title2");

    titleElement.find("img").remove(); // 이미지 제거
    titleElement.find("sup").remove(); // <sup> 요소 제거
    const title = titleElement.text().trim() || $(".view_title").text().trim();

    const nickname = $("font.view_name").text();

    const createdAtT = $(
      "body > div.wrapper > div.contents > div.container > div > table:nth-child(10) > tbody > tr:nth-child(2) > td"
    )
      .text()
      .match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    const createdAtT2 = body.match(/등록일: (\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
    const createdAt =
      createdAtT && createdAtT.length > 0
        ? createdAtT[0]
        : createdAtT2 && createdAtT2.length > 0
          ? createdAtT2[0].replace("등록일: ", "")
          : null;
    const mainCommentIndex = "1";
    const tag = [
      $("font.view_cate").text(),
      $("#header_box > div.side > p > a").text(),
      $("#header_box > div.bbs_title > h1 > a").text(),
    ].filter((i) => !!i && !i.includes("뽐뿌") && i.length < 12 && i != "일반");
    const view =
      body.match(/조회수: (\d+)/) && body.match(/조회수: (\d+)/).length > 0 ? body.match(/조회수: (\d+)/)[1] : 0;
    const like = $("li#top_vote_item > strong").text() ? Number($("li#top_vote_item > strong").text()) : 0;

    let isBreak = false;

    //#region First comment

    const getCommentText = (el: Element) => {
      let t = "";
      // 이미지 주소 추출
      const video = $(el).find("video > source").attr("src");
      const link = $(el).find("a").attr("href");
      const imgUrl =
        $(el).find("img").attr("src") &&
        !$(el).find("img").attr("src")?.includes("data:image") &&
        !$(el).find("img").attr("src")?.includes("lazyloading.jpg")
          ? $(el).find("img").attr("src")
          : !$(el).find("img").attr("data-original")?.includes("data:image")
            ? $(el).find("img").attr("data-original")
            : null;
      const text = $(el).find("span").text().trim();
      const textEtc = $(el).text().trim();
      //TODO 줄 바꿈 DB에 잘 저장되는지 확인 필요
      if (video) t += video.replace(/^(?!https:)(\/\/cdn(\d{0,2})?\.ppomppu)/, "https://cdn$2.ppomppu") + " \n";
      else if (link) t += link.replace(/^(?!https:)(\/\/cdn(\d{0,2})?\.ppomppu)/, "https://cdn$2.ppomppu") + " \n";
      else if (imgUrl) t += imgUrl.replace(/^(?!https:)(\/\/cdn(\d{0,2})?\.ppomppu)/, "https://cdn$2.ppomppu") + " \n";
      else if (text) t += text + " \n";
      else if (textEtc) t += textEtc + " \n";
      return t;
    };
    let content = "";
    $("td.board-contents > p").each((i, el) => {
      content += getCommentText(el);
    });

    const user = getRealUserId((userIndices.get(nickname) || 0) + randomId);

    commentList.push({
      index: 1,
      createdAt,
      createdUserId: user.userId,
      createdUserEmoji: user.userEmoji,
      content: content,
    });
    //#endregion

    const body2 = await axios
      .get(url.replace("view.php", "comment.php") + "&c_page=1&comment_mode=", {
        responseType: "arraybuffer",
        transformResponse: [(data) => iconv.decode(Buffer.from(data), "EUC-KR")],
      })
      .then((d) => d.data);

    const getNickname = (el: Cheerio<Element>) => {
      return el.find("b > a").text().trim() || el.find("b > a > img").attr("alt") || "";
    };
    const extractComments = (html: string) => {
      const $ = load(html);

      $("div.comment_div0").each((_, commentElement) => {
        // 댓글 추가
        const $comment = $(commentElement);
        const nickname = getNickname($comment.find(".comment_template_depth1_comment_line"));

        let content = "";
        $comment.find("p").each((i, el) => {
          content += getCommentText(el);
        });
        if (!content)
          content = $comment.find(".comment_template_depth1_comment_line").find(".mid-text-area").text().trim();

        const createdAt =
          $comment.find(".comment_template_depth1_comment_line").find(".eng-day").attr("title") ||
          dayjs(
            dayjs().format("YYYY-MM-DD ") +
              $comment.find(".comment_template_depth1_comment_line").find(".eng-day").text()
          ).format("YYYY-MM-DD HH:mm:ss") ||
          null;
        // console.info(content, createdAt, $comment.find(".comment_template_depth1_comment_line").find(".eng-day").text());

        if (!userIndices.has(nickname)) userIndices.set(nickname, currentUniqueId++);
        const user = getRealUserId((userIndices.get(nickname) || 0) + randomId);

        const parentIndex = commentList.length + 1;
        if (!content) return;
        commentList.push({
          index: parentIndex,
          createdAt: createdAt,
          createdUserId: user.userId,
          createdUserEmoji: user.userEmoji,
          content: content,
        });

        // 대댓글 추가
        $comment.find("div.comment_template_depth2").each((_, replyCommentElement) => {
          const $replycomment = $(replyCommentElement);
          const nickname = getNickname($replycomment.find(".comment_template_depth2_comment_line"));

          let content = "";
          $replycomment.find("p").each((i, el) => {
            content += getCommentText(el);
          });
          if (!content)
            content = $replycomment.find(".comment_template_depth2_comment_line").find(".mid-text-area").text().trim();

          const createdAt =
            $replycomment.find(".comment_template_depth2_comment_line").find(".eng-day").attr("title") ||
            `${new Date().toISOString().slice(0, 10)} ${$replycomment
              .find(".comment_template_depth2_comment_line")
              .find(".eng-day")
              .text()
              .slice(0, 8)}` ||
            null;

          if (!userIndices.has(nickname)) userIndices.set(nickname, currentUniqueId++);
          const user = getRealUserId((userIndices.get(nickname) || 0) + randomId);
          if (content)
            commentList.push({
              index: commentList.length + 1,
              createdAt: createdAt,
              createdUserId: user.userId,
              createdUserEmoji: user.userEmoji,
              content: `>>${parentIndex} ` + content,
            });
        });
      });
    };
    extractComments(body2);

    //min-length 10
    if (commentList.length < 10) return res.status(400).json({ result: null, error: "min comment length is 10" });
    // block-word check
    if (isBreak) return res.status(400).json({ result: null, error: "block word true" });

    threadId = await saveThreadPublic(commentList, threadId, tag, title, mainCommentIndex, parseInt(view), url, like);

    res.status(200).json({ result: threadId, error: null });
    // await
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
