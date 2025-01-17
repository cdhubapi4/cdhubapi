import saveThreadPublic, { Comment } from "@/components/function-api/saveThreadPublic";
import { getRealUserId, userList } from "@/components/function-api/userList";
import axios from "axios";
import { load } from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

// curl -GET http://localhost:3000/api/craw-add-natepan?url=https://m.pann.nate.com/talk/370646494
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { url } = req.query;
    if (typeof url !== "string") return res.status(400).json({ result: null, error: "no params: url" });
    if (url.length > 511)
      return res.status(400).json({ result: null, error: "out params: out length url max length 511" });
    if (!url.includes("pann.nate.com"))
      return res.status(400).json({ result: null, error: "out params: domain pann.nate.com" });
    // #endregion;

    // Replace the URL if needed
    let modifiedUrl = url.split("?")[0];
    if (url.startsWith("https://pann.nate.com"))
      modifiedUrl = url.replace("https://pann.nate.com", "https://m.pann.nate.com");

    // #region thread_url check
    const result2 = await db.query<{ thread_id: number; url: string }[]>(
      `SELECT thread_id, url FROM thread_url WHERE url = ?;`,
      [modifiedUrl]
    );
    // if (result2.length > 0) return res.status(400).json({ result: null, error: "out url: this url complete already." });
    let threadId = result2.length > 0 ? result2[0].thread_id : null;
    //#endregion

    //#region Crawling

    //#region Default Data
    const response = await axios.get(modifiedUrl);
    const body = response.data;
    const randomId = Math.floor(Math.random() * userList.length);

    const $ = load(body);

    const commentList: Comment[] = [];
    // comment length Check
    // -> min-length 10
    const commentLength = $("#contents > div.pann-title > div > div.con_info > ul > li:nth-child(1) > a > span").text();
    if (Number(commentLength) < 10) return res.status(400).json({ result: null, error: "min comment length is 10" });

    const userIndices = new Map<string, number>();
    let currentUniqueId = 1;

    const title = $(".pann-title > h1").text().trim();
    if (!title) return res.status(400).json({ result: null, error: "no title: pann.nate.com, url:" + modifiedUrl });

    const mainCommentIndex = "1";
    const tag: string[] = [];
    const view = $("#contents > div.pann-title > div > div:nth-child(2) > span:nth-child(1)")
      .text()
      .replace(/,/g, "")
      .trim();
    // const likeCount = parseInt($("div.updown .btnbox.up .count span").last().text().trim(), 10);
    // const disLikeCount = parseInt($("div.updown .btnbox.down .count span").last().text().trim(), 10);

    const tag1 = $("div.view_cate:first > a.cate").text().trim();
    if (tag1 && !tag1.includes("[") && !tag1.includes("+")) tag.push(tag1);
    const tag2 = $("div.view_cate:first > a.ch").text().trim();
    if (tag2 && !tag2.includes("[") && !tag2.includes("+")) tag.push(tag2);

    let commentFirstContent = $("#pann-content > p").length === 0 ? $("#pann-content").text().trim() : "";
    if (commentFirstContent === "")
      commentFirstContent = $("#pann-content > p:not(.mweb_img)")
        .map(function () {
          return $(this).text().trim() || $(this).find("img.hasOrigin").attr("src");
        })
        .get()
        .filter(Boolean)
        .join("\n");
    if (commentFirstContent === "")
      commentFirstContent =
        $("#pann-content")
          .html()
          ?.replace(/<!-- 투표영역 -->/g, "")
          .replace(/<br>/g, "")
          .replace(/<img [^>]*?src="([^"]+)"[^>]*>/g, '<img src="$1">')
          .replace(/<p class="mweb_img"><a [^>]*><img src="([^"]+)"><\/a><\/p>/g, "$1")
          .trim() || "";

    const commentFirstCreatedAt = $("div.writer .sub span.num").first().text().trim().replace(/\./g, "-") + ":00";

    commentList.push({
      createdAt: commentFirstCreatedAt,
      index: 1,
      createdUserId: getRealUserId(randomId).userId,
      createdUserEmoji: getRealUserId(randomId).userEmoji,
      content: commentFirstContent,
    });
    //#endregion

    //#region GET comment / reply
    const panid = modifiedUrl.split("/").pop();
    const getCommentList = async (panid: string | undefined, page: number): Promise<boolean> => {
      return new Promise(async (resolve) => {
        if (!panid) return resolve(false);
        const commentTotalURL = `https://m.pann.nate.com/talk/reply/view?pann_id=${panid}&replyOrder=R&currMenu=today&vPage=1&order=N&rankingType=total&page=${page}`;
        const response2 = await axios.get(commentTotalURL).then((d) => d.data);
        const $ = load(response2);
        const baseUrl = "https://m.pann.nate.com";
        const listDlElements = $("#listDiv dl");
        const isPageNext = $(`div.paging.panel_last a[title="${page + 1}페이지"]`).length > 0;

        for (let i = 0; i < listDlElements.length; i++) {
          const dlElement = $(listDlElements[i]);

          // Comment Text
          let commentText = "";
          const userTextElement = dlElement.find("dd.userText");
          commentText += userTextElement
            .contents()
            .filter(function () {
              return this.nodeType === 3; // Node.TEXT_NODE
            })
            .text()
            .trim();
          if (userTextElement.find("img").length) commentText += "\n" + userTextElement.find("img").attr("src");
          const replyCount = parseInt(dlElement.find("dd.btn > a").first().find("em").text().trim()) || 0;
          // 부모댓글
          const user = getRealUserId(commentList.length + randomId + 1);
          const createdAt = dlElement.find("dt > em").text().trim().replace(/\./g, "-") + ":00";

          if (createdAt && createdAt != ":00")
            commentList.push({
              index: commentList.length + 1,
              createdAt,
              createdUserId: user.userId,
              createdUserEmoji: user.userEmoji,
              content: commentText,
            });
          const parentIndex = commentList.length;
          // 자식 댓글
          if (replyCount > 0) {
            const href = baseUrl + dlElement.find("dd.btn > a").first().attr("href");
            const replyId = href.match(/prts_reply_id=(\d+)/);
            if (replyId) {
              const url = `${baseUrl}/talk/reply/subReply?pann_id=${panid}&prts_reply_id=${replyId[1]}&currMenu=&vPage=1&order=N&stndDt=&q=&gb=&rankingType=total&rPage=1`;
              const response = await axios.get(url);
              const d = response.data;
              const $ = load(d);
              const replyDlElements = $("#listDiv dl.r-reply");

              for (let j = 0; j < replyDlElements.length; j++) {
                const dlEl = $(replyDlElements[j]);
                const replyCreatedAt = dlEl.find("dt > em").text().trim().replace(/\./g, "-") + ":00";
                const user = getRealUserId(commentList.length + randomId + 1);

                let replyText = dlEl.find(".userText > em").text().trim();
                if (dlEl.find("img").length > 0) {
                  const imageUrl = dlEl.find("img").attr("src");
                  replyText += `\n${imageUrl}`;
                }

                if (replyCreatedAt && replyText)
                  commentList.push({
                    index: commentList.length + 1,
                    createdAt: replyCreatedAt,
                    createdUserId: user.userId,
                    createdUserEmoji: user.userEmoji,
                    content: `>>${parentIndex} ` + replyText,
                  });
              }
            }
          }
        }
        return resolve(isPageNext);
      });
    };
    let page = 1;
    let isNext = true;
    while (isNext && page <= 10) {
      isNext = await getCommentList(panid, page);
      page++;
    }

    //#endregion

    // // block-word check
    // if (isBreak) return res.status(400).json({ result: null, error: "block word true" });

    threadId = await saveThreadPublic(commentList, threadId, tag, title, mainCommentIndex, parseInt(view), modifiedUrl);

    res.status(200).json({ result: threadId, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
