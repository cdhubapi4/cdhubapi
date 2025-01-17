import { DefaultModalTemplete, ModalState } from "@/components/layout";
import { UserDataType } from "@/components/util/getUserData";
import { t } from "@/components/util/translate";
import { CommentType } from "@/pages/api/thread-public-read-comment";
import { css } from "@emotion/react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { KeyedMutator } from "swr";
import Ripple from "../../layout/Ripple";
import { TextareaStyle } from "../community/CommunityTextarea";
dayjs.extend(relativeTime);
dayjs.locale("ko");

export const CommentCard = ({
  index,
  comment,
  setComment,
  threadId,
  onDelete,
  userData,
}: {
  index: string;
  comment: CommentType;
  setComment: KeyedMutator<CommentType[]>;
  userData: UserDataType;
  threadId?: number;
  onDelete?: () => void;
}) => {
  const [isMore, setIsMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLike, setIsLike] = useState(comment.is_like ? true : false);
  const [isDislike, setIsDislike] = useState(comment.is_dislike ? true : false);
  const setModal = useSetRecoilState(ModalState);
  const inputRef = useRef("");
  const {
    profile_emoji,
    user_id,
    nickname,
    settings: { language },
  } = userData;

  //#region all functions
  //#region common functions
  const mutateCommentById = (targetCommentId: number, opt: object): void => {
    setComment((oldCommentList: CommentType[] | undefined) => {
      if (!oldCommentList) return;
      return oldCommentList.map((comment: CommentType) =>
        comment.comment_id === targetCommentId ? { ...comment, ...opt } : comment
      );
    }, false);
  };

  const handleOpenClick = () => setIsOpen(!isOpen);
  const handleLikeClick = async (type: "like" | "dislike") => {
    if (!comment.comment_id) return;
    if (type === "like") {
      setIsLike(!isLike);
      mutateCommentById(comment.comment_id, { like_count: comment.like_count + (isLike ? -1 : 1) });
      await axios.post(`/api/thread-public-${isLike ? "delete" : "add"}-comment-like`, {
        comment_id: comment.comment_id,
      });
    } else {
      setIsDislike(!isDislike);
      // mutateCommentById(comment.comment_id, { dislike_count: comment.dislike_count + (isDislike ? -1 : 1) });
      await axios.post(`/api/thread-public-${isDislike ? "delete" : "add"}-comment-dislike`, {
        comment_id: comment.comment_id,
      });
    }
  };
  //#endregion

  //#region Reply functions
  const isReply = comment.reply_parent_comment_id != null;
  const onReply = async () => {
    if (!profile_emoji || !user_id || !nickname) return;
    if (!inputRef.current) return alert(t["댓글 내용을 입력해주세요"][language]);
    setModal(null);

    // 1 add temp reply comment
    setComment(async (prev) => {
      if (!profile_emoji || !user_id || !nickname) return prev;
      if (!prev) return prev;
      const maxGroupIndex = Math.max(...prev.map((p) => p.reply_group_index)) + 1;
      const newComment: CommentType = {
        thread_id: 0,
        title: nickname,
        content: inputRef.current,
        created_user_id: user_id,
        profile_emoji: profile_emoji,
        like_count: 0,
        dislike_count: 0,
        created_at: dayjs().subtract(9, "hour").format("YYYY-MM-DD HH:mm:ss"),
        is_content_modified: 0,
        is_like: 0,
        is_dislike: 0,
        comment_id: 0, //temp comment_id
        reply_parent_comment_id: comment.comment_id,
        reply_group_id: comment.reply_group_id,
        reply_group_index: maxGroupIndex, //temp reply_group_index
        child_comment_count: 0,
        deleted_at: null,
      };
      // order by
      return [...prev, newComment].sort((a, b) => {
        if (a.reply_group_id > b.reply_group_id) return -1;
        if (a.reply_group_id < b.reply_group_id) return 1;
        if (a.reply_group_index < b.reply_group_index) return -1;
        if (a.reply_group_index > b.reply_group_index) return 1;
        return 0;
      });
    }, false);

    await axios.post("/api/thread-public-create-comment", {
      thread_id: comment.thread_id,
      content: inputRef.current,
      parent_comment_id: comment.comment_id,
      reply_group_id: comment.reply_group_id,
    });
    setComment();
  };
  const setReplyModal = () => {
    inputRef.current = "";
    setModal(
      DefaultModalTemplete(
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          <div className="message-title">{t["댓글 내용"][language]}</div>
          <TextareaAutosize
            autoFocus
            css={TextareaStyle}
            minRows={3}
            onChange={({ target: { value } }) => (inputRef.current = value)}
          />
          <button className="button-dark" style={{ marginTop: 24 }} onClick={onReply}>
            {t["댓글 달기"][language]}
          </button>
        </div>
      )
    );
  };

  const onEditComment = async () => {
    if (!inputRef.current) return alert(t["댓글 내용을 입력해주세요"][language]);
    setModal(null);

    // add temp reply comment
    setComment(async (prev) => {
      if (!prev) return prev;
      return prev.map((c) =>
        c.comment_id === comment.comment_id ? { ...c, content: inputRef.current, is_content_modified: 1 } : c
      );
    }, false);

    await axios.post("/api/thread-public-update-comment", {
      comment_id: comment.comment_id,
      content: inputRef.current,
    });
    setComment();
  };

  const setEditModal = () => {
    inputRef.current = "";
    setModal(
      DefaultModalTemplete(
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          <div className="message-title">{t["수정할 댓글 내용"][language]}</div>
          <TextareaAutosize
            autoFocus
            css={TextareaStyle}
            minRows={3}
            onChange={({ target: { value } }) => (inputRef.current = value)}
          />

          <button className="button-dark" style={{ marginTop: 24 }} onClick={onEditComment}>
            {t["댓글 수정하기"][language]}
          </button>
        </div>
      )
    );
  };
  const onDeleteComment = async () => {
    if (!threadId) return;
    const check = confirm(t["정말로 댓글을 삭제하시겠습니까?"][language]);
    if (!check) return;

    await axios.post("/api/thread-public-delete-comment", {
      comment_id: comment.comment_id,
      reply_group_index: comment.reply_group_index,
      reply_parent_comment_id: comment.reply_parent_comment_id,
      created_user_id: comment.created_user_id,
      thread_id: threadId,
    });
    setComment();
    if (onDelete) onDelete();
  };
  //#endregion
  //#endregion

  const isDeleted = comment.deleted_at !== null;

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {isReply && (
        <Image
          width={20}
          height={15.65}
          src={"/icon/ic_reply.svg"}
          alt="reply"
          style={{ marginLeft: 10, marginTop: 16 }}
        />
      )}
      <div css={CommentCardStyle} style={isReply ? { width: "min(100vw - 100px, 500px)" } : undefined}>
        <div className="right-container">
          <button>
            {comment.profile_emoji}
            {/* <Ripple /> */}
          </button>
        </div>
        <div className="left-container">
          <div className="top">
            <button disabled className="title" style={{ padding: 0, margin: 0, cursor: "default" }}>
              #{index} {comment.title} <Ripple />
            </button>
            <div className="sub-text" style={{ paddingRight: 6 }}>
              {dayjs(comment.created_at).subtract(1, "second").add(9, "hour").fromNow()}
              {comment.is_content_modified ? " (수정됨)" : ""}
            </div>
          </div>
          <div className={"middle"}>
            <div
              className={`${isMore ? "ellipse" : ""}  ${isOpen ? "open" : ""} ${
                isDeleted ? "sub-text" : "message-content"
              }`}
              style={isDeleted ? { marginTop: 4 } : undefined}
              ref={(r) => {
                // enable more btn
                const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
                const maxHeight = 3 * remInPixels; //3rem
                if (r && r.clientHeight && r.clientHeight > maxHeight) setIsMore(true);
              }}
            >
              {isDeleted ? t["(삭제됨)"][language] : comment.content}
            </div>
            {isMore && (
              <button className="more-button sub-text" onClick={handleOpenClick}>
                <div>{isOpen ? t["접기"][language] : t["자세히 보기"][language]}</div>
                <Ripple />
              </button>
            )}
          </div>
          <div className="bottom">
            {isDeleted ? null : (
              <div>
                <button
                  className={`sub-main-text like-button ${isLike ? "liked" : ""}`}
                  onClick={() => handleLikeClick("like")}
                >
                  <Image
                    width={15.7}
                    height={14}
                    src={isLike ? "/icon/ic_like.svg" : "/icon/ic_like_empty.svg"}
                    alt="like"
                    style={{ opacity: isLike ? 1 : 0.8 }}
                  />
                  {comment.like_count || t["좋아요"][language]}
                  <Ripple />
                </button>
                <button
                  className={`sub-main-text dislike-button ${isDislike ? "disliked" : ""}`}
                  onClick={() => handleLikeClick("dislike")}
                >
                  <Image
                    width={15.7}
                    height={14}
                    src={isDislike ? "/icon/ic_dislike.svg" : "/icon/ic_dislike_empty.svg"}
                    style={{ opacity: isDislike ? 1 : 0.8 }}
                    alt="dislike"
                  />
                  {t["싫어요"][language]}
                  {/* {comment.dislike_count || t["싫어요"][language]} */}
                  <Ripple />
                </button>
                <button className="sub-main-text" onClick={setReplyModal}>
                  {t["대댓글달기"][language]}
                  <Ripple />
                </button>
              </div>
            )}
            <div>
              {isDeleted ? null : comment.created_user_id == user_id ? (
                <div style={{ display: "flex", gap: "1.3333333333333335vw" }}>
                  <button className="sub-main-text" style={{ color: "#bbb9b9" }} onClick={setEditModal}>
                    {t["수정"][language]}
                    <Ripple />
                  </button>
                  <button className="sub-main-text" style={{ color: "#bbb9b9" }} onClick={onDeleteComment}>
                    {t["삭제"][language]}
                    <Ripple />
                  </button>
                </div>
              ) : (
                <button
                  className="sub-main-text"
                  style={{ color: "#bbb9b9" }}
                  onClick={() => {
                    //email 템플릿 수정필요
                    window.open("mailto:spacechat-io@proton.me");
                  }}
                >
                  {t["신고"][language]}
                  <Ripple />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const CommentCardStyle = css`
  @keyframes heart-beat {
    0% {
      transform: scale(0.76923077);
    }
    25% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.76923077);
    }
    75% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.76923077);
    }
  }

  .like-button.liked img {
    animation: heart-beat 0.5s;
  }

  @keyframes shake {
    0% {
      transform: translate(0.5px, 0.5px) rotate(0deg);
    }
    10% {
      transform: translate(-0.5px, -1px) rotate(-0.5deg);
    }
    20% {
      transform: translate(-1.5px, 0px) rotate(0.5deg);
    }
    30% {
      transform: translate(1.5px, 1px) rotate(0deg);
    }
    40% {
      transform: translate(0.5px, -0.5px) rotate(0.5deg);
    }
    50% {
      transform: translate(-0.5px, 1px) rotate(-0.5deg);
    }
    60% {
      transform: translate(-1.5px, 0.5px) rotate(0deg);
    }
    70% {
      transform: translate(1.5px, 0.5px) rotate(-0.5deg);
    }
    80% {
      transform: translate(-0.5px, -0.5px) rotate(0.5deg);
    }
    90% {
      transform: translate(0.5px, 1px) rotate(0deg);
    }
    100% {
      transform: translate(0.5px, -1px) rotate(-0.5deg);
    }
  }

  .dislike-button.disliked img {
    animation: shake 0.5s;
  }

  border-radius: 10px;
  border: 1px solid #313154;
  background: #21212d;
  width: min(100vw - 50px, 550px);

  div {
    display: flex;
  }
  display: flex;
  padding: 12px 14px 12px 10px;
  flex-direction: row;
  gap: 8px;

  .right-container {
    button {
      background: none;
      display: flex;
      height: fit-content;
      padding: 4px;
      border-radius: 100px;
      font-size: 24px;
    }
  }

  .left-container {
    flex-direction: column;
    flex: 1;
    width: min(100vw - 100px, 500px);

    button {
      background: none;
      display: flex;
      height: fit-content;
      padding: 4px 6px;
      align-items: center;
      gap: 4px;
      border-radius: 2px;

      color: #ffffffeb;
      font-size: 0.6rem;
    }

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-family:
          Spoqa Han Sans Neo,
          -apple-system,
          BlinkMacSystemFont,
          "Malgun Gothic",
          "맑은 고딕",
          helvetica,
          "Apple SD Gothic Neo",
          sans-serif;
        font-size: 0.7692307692307693rem; /* 10px */
        font-style: normal;
        font-weight: 400;
        line-height: normal; /* 14px */
        letter-spacing: -0.4px;
        color: #d2d2d5;
      }
    }
    .middle {
      flex-direction: column;
    }
    .middle > .message-content {
      white-space: pre-wrap;
      word-break: break-word;
    }
    .middle > .ellipse {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }

    .middle > .message-content.open {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1000;
    }

    .more-button {
      display: flex;
      justify-content: center;
      color: #fffffffd;
      font-size: 0.6rem;

      margin-top: 8px;

      div {
        position: relative;
        left: min(-24px, 4vw);
      }
    }
    .bottom {
      margin-top: 8px;

      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        display: flex;
        gap: 2.666666666666667vw;

        align-items: center;
      }
    }
  }
`;
