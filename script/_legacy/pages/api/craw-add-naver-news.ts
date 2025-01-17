import saveThreadPublic, { Comment } from "@/components/function-api/saveThreadPublic";
import { load } from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import { userList, getRealUserId } from "@/components/function-api/userList";
import axios from "axios";
import dayjs from "dayjs";

// curl -GET http://localhost:3000/api/craw-add-naver-news?url=https://n.news.naver.com/article/005/0001640278
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // try {
  // //#region params check

  // const { url } = req.query;
  // if (typeof url !== "string") return res.status(400).json({ result: null, error: "no params: url" });
  // if (url.length > 511)
  //   return res.status(400).json({ result: null, error: "out params: out length url max length 511" });
  // if (!url.includes("n.news.naver.com"))
  //   return res.status(400).json({ result: null, error: "out params: domain n.news.naver.com" });
  // //#endregion

  // const split = url.split("/");
  // const naverCategoryId = split[4];
  // const naverNewsId = split[5];

  // // #region thread_url check
  // const result2 = await db.query<{ thread_id: number; url: string }[]>(
  //   `SELECT thread_id, url FROM thread_url WHERE url = ?;`,
  //   [url]
  // );
  // if (result2.length > 0) return res.status(400).json({ result: null, error: "out url: this url complete already." });
  // let threadId = result2.length > 0 ? result2[0].thread_id : null;
  // //#endregion

  // //#region Crawling
  // const response = await axios.get(url);
  // const body = response.data;
  // const randomId = Math.floor(Math.random() * userList.length);

  // const $ = load(body);

  // const commentList: Comment[] = [];
  // const userIndices = new Map<string, number>();
  // let currentUniqueId = 1;

  // const title = $("h2#title_area > span").text().trim();
  // const mainCommentIndex = "1";
  // const tagList = ["뉴스"];
  // const tag1 = $("em.media_end_categorize_item").text().trim();
  // if (tag1) tagList.push(tag1);
  // const tag2 = $(".media_end_head_top_logo > img:first-child").attr("alt");
  // if (tag2) tagList.push(tag2);
  // // const view = $("").text().replace("Hit", "").trim();

  // const createdAt = $("span._ARTICLE_DATE_TIME").attr("data-date-time") || "";

  // const originLink = $("a.media_end_head_origin_link").attr("href");
  // if (!originLink) return res.status(400).json({ result: null, error: "out data: no originLink" });
  // let output: string[] = [];
  // $("#dic_area")
  //   .contents()
  //   .each((index, element) => {
  //     const text = $(element).text().trim();
  //     const img = $(element).find("img").attr("data-src");
  //     if (element.type === "tag" && img) output.push(img);
  //     else if (element.type === "text" && text) output.push(text.replace(/<br><br>/g, "\n\n"));
  //   });
  // const content = title + "\n\n" + output.join("\n\n") + "\n\n\n원문: " + originLink;

  // const nickname = "first-comment";
  // if (!userIndices.has(nickname)) userIndices.set(nickname, currentUniqueId++);
  // const user = getRealUserId((userIndices.get(nickname) || 0) + randomId);

  // commentList.push({
  //   createdAt,
  //   index: 1,
  //   createdUserId: user.userId,
  //   createdUserEmoji: user.userEmoji,
  //   content,
  // });

  // let isBreak = false;

  // const commentRes = await axios.get(
  //   `https://apis.naver.com/commentBox/cbox/web_naver_list_jsonp.json?ticket=news&templateId=default_politics&pool=cbox5&lang=ko&objectId=news${naverCategoryId}%2C${naverNewsId}&pageSize=1000&indexSize=0&page=1&currentPage=1&sort=favorite`,
  //   { headers: { referer: `https://n.news.naver.com/article/comment/${naverCategoryId}/${naverNewsId}` } }
  // );

  // // 응답 문자열에서 JSONP 콜백 이름과 괄호를 제거합니다.
  // const jsonStart = commentRes.data.indexOf("(") + 1;
  // const jsonEnd = commentRes.data.lastIndexOf(")");
  // const jsonString = commentRes.data.slice(jsonStart, jsonEnd);
  // // JSON 문자열을 파싱합니다.
  // const jsonResponse = JSON.parse(jsonString) as CommentResType;

  // jsonResponse.result.commentList.map((element, i) => {
  //   const nickname = element.userName;
  //   const index = commentList.length + 1;
  //   const createdAt = dayjs(element.modTime).format("YYYY-MM-DD HH:mm:ss");
  //   const commentText = element.contents;
  //   // nickname에 대한 고유 번호 할당
  //   if (!userIndices.has(nickname)) userIndices.set(nickname, currentUniqueId++);
  //   const user = getRealUserId((userIndices.get(nickname) || 0) + randomId);

  //   if (commentText.includes("삭제된 댓글") || commentText.includes("부적절한 표현")) return;

  //   commentList.push({
  //     index,
  //     createdAt,
  //     createdUserId: user.userId,
  //     createdUserEmoji: user.userEmoji,
  //     content: commentText,
  //   });
  // });
  // // #endregion

  // //min-length 80
  // if (commentList.length < 5) return res.status(200).json({ result: null, error: "min comment length is 5" });
  // // block-word check
  // if (isBreak) return res.status(400).json({ result: null, error: "block word true" });

  // threadId = await saveThreadPublic(
  //   commentList,
  //   threadId,
  //   tagList,
  //   title,
  //   mainCommentIndex,
  //   commentList.length * 21,
  //   url
  // );

  //   res.status(200).json({ result: threadId, error: null });
  // } catch (error) {
  //   console.error(error);
  //   res.status(400).json({ result: null, error });
  // }
  res.status(200).json({ result: 0, error: null });
};

type CommentResType = {
  success: boolean; //true;
  code: string; // "1000";
  message: string; // "요청을 성공적으로 처리하였습니다.";
  lang: string; // "ko";
  country: string; // "KR";
  result: {
    commentList: CommentType[];
    pageModel: {
      page: number; //3;
      pageSize: number; //100;
      indexSize: number; //10;
      startRow: number; //201;
      endRow: number; //113;
      totalRows: number; //113;
      startIndex: number; //200;
      totalPages: number; //2;
      firstPage: number; //1;
      prevPage: number; //2;
      nextPage: number; //0;
      lastPage: number; //2;
      current: null;
      threshold: null;
      moveToLastPage: boolean; // false;
      moveToComment: boolean; // false;
      moveToLastPrev: boolean; // false;
    };
    morePage: {
      prev: string; // "063whb0bwz8au";
      next: string; // "063wbyawr1ykq";
      start: string; // "063wiec3n64ra";
      end: string; // "063wbyawr1ykq";
    };
    exposureConfig: {
      reason: null;
      status: string; // "COMMENT_ON"
    };
    count: {
      comment: number; //113;
      reply: number; //19;
      exposeCount: number; //108;
      delCommentByUser: number; //6;
      delCommentByMon: number; //0;
      blindCommentByUser: number; //0;
      blindReplyByUser: number; //0;
      total: number; //132;
    };
    listStatus: string; // "all";
    sort: string; // "NEW";
    bestList: [];
  };
  date: string; // "2023-09-23T11:40:53+0000";
};

type CommentType = {
  anonymous: boolean; //false;
  antipathy: boolean; //false;
  antipathyCount: number; // 0;
  attachmentList: [];
  best: boolean; //false;
  blind: boolean; //false;
  blindReport: boolean; //false;
  categoryId: string; //"*";
  categoryImage: null;
  chattingBridge: boolean; //false;
  commentNo: string; //"803988790447177860";
  commentType: string; //"txt";
  containText: boolean; //true;
  contents: string; //"민주당  조오섭 의원도 “부결에 투표했다”고 공개하면서 “무기명 투표라는 국회법 취지보다 당원들의 의문에 답하는 것이 도리라 여겨 말씀드린다”고 적었다";
  country: string; //"KR";
  defamation: boolean; //false;
  deleted: boolean; //false;
  expose: boolean; //true;
  exposeByCountry: boolean; //true;
  exposedUserIp: null;
  extension: null;
  following: boolean; //false;
  grades: null;
  hiddenByCleanbot: boolean; //false;
  hideReplyButton: boolean; //false;
  idNo: string; //"hk1V";
  idProvider: string; //"naver";
  idType: string; //"naver";
  imageCount: number; //0;
  imageHeightList: null;
  imageList: null;
  imagePathList: null;
  imageWidthList: null;
  inspectionId: null;
  lang: string; //"ko";
  levelCode: null;
  manager: boolean; //false;
  managerLike: boolean; //false;
  maskedUserId: string; //"nacj****";
  maskedUserName: string; //"na****";
  mentions: null;
  metaInfo: null;
  middleBlindReport: boolean; //false;
  mine: boolean; //false;
  modTime: string; //"2023-09-23T17:28:30+0900";
  modTimeGmt: string; //"2023-09-23T08:28:30+0000";
  objectId: string; //"news005,0001640278";
  open: boolean; //false;
  originalStatus: number; //0;
  parentCommentNo: string; //"803988790447177860";
  pick: boolean; //false;
  profileType: string; //"naver";
  profileUserId: null;
  ratings: null;
  reference: null;
  regTime: string; //"2023-09-23T17:28:30+0900";
  regTimeGmt: string; //"2023-09-23T08:28:30+0000";
  replyAllCount: number; //0;
  replyCount: number; // 0;
  replyLevel: number; // 1;
  replyList: null;
  replyPreviewNo: null;
  report: null;
  score: number; // 0;
  secret: boolean; //false;
  serviceId: string; //"news";
  sortValue: number; //1695457710914;
  spamInfo: null;
  status: number; //0;
  sticker: null;
  stickerId: null;
  sympathy: boolean; //false;
  sympathyCount: number; //0;
  templateId: string; //"default_politics";
  ticket: string; //"news";
  toUser: null;
  translation: null;
  userBlocked: boolean; //false;
  userHomepageUrl: null;
  userIdNo: string; //"hk1V";
  userName: string; //"nacj****";
  userProfileImage: string; //"https://phinf.pstatic.net/contact/20210511_63/1620660636871TdvGc_PNG/avatar_profile.png";
  userStatus: number; //0;
  validateBanWords: boolean; //false;
  virtual: boolean; //false;
  visible: boolean; //true;
};
