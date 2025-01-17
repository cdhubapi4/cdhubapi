import { encrypt } from "@/components/util/Crypto";
import { toShortNum } from "@/components/util/toShortNum";
import { css } from "@emotion/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { CSSProperties, useState } from "react";
import { CommunityRoomType } from "./CommunityRoomList";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.locale("ko");

type Props = {
  style?: CSSProperties;
  room: CommunityRoomType;
};
export const CommunityRoomCard = ({ style, room }: Props) => {
  const router = useRouter();
  const {
    last_index,
    profile_emoji,
    title,
    view,
    modified_at,
    content,
    tag,
    person_like_count,
    person_dislike_count,
    comment_count,
    created_at,
  } = room;
  const percent = Math.floor((person_like_count / (person_like_count + person_dislike_count || 1)) * 100);
  const isSuperLike = percent >= 80;
  const isEmptyLike = person_like_count + person_dislike_count != 0 && percent < 50;

  const [isMove, setIsMove] = useState(false);
  const onClick = () => {
    if (isMove) return;
    router.push(`/community/message?id=${encrypt(JSON.stringify(room)) + ""}`);
    setIsMove(false);
  };

  return (
    <button
      css={Style}
      style={style}
      onMouseDown={() => setIsMove(false)}
      onMouseMove={() => setIsMove(true)}
      onClick={onClick}
    >
      <div className="top message-title">
        <div className="community-title-container">
          <div className="last_index">#{last_index}</div>

          <div className="community-title ellipse-1">
            <span className="community-emoji">{profile_emoji}</span>
            {title}
          </div>
        </div>
        <div className="community-left-container">
          <div className="view sub-main-text">
            <img width={16} height={14.76} src="/icon/ic_view.png" alt="view" />
            {toShortNum(view)}
          </div>
          <div className="date sub-text">{dayjs(modified_at).fromNow()}</div>
        </div>
      </div>
      <div className="middle">
        <div className="content message-content ellipse-3">{content}</div>
      </div>
      <div className="bottom">
        <div className="tag-list">
          {tag && tag.map
            ? tag.map((tag: string) => (
                <span className="sub-text" key={tag}>
                  #{tag}
                </span>
              ))
            : null}
        </div>
        <div className="sub-bottom">
          <div className="like">
            <Image
              width={15.7}
              height={14}
              src={isEmptyLike ? "/icon/ic_like_empty.svg" : "/icon/ic_like.svg"}
              alt="like"
            />
            <span className="like-good sub-main-text">{toShortNum(person_like_count)}</span>
            <span className={"like-percent sub-main-text" + (isSuperLike ? " blue" : isEmptyLike ? " red" : "")}>
              {percent}%
            </span>
          </div>
          <div className="comment sub-main-text">
            <Image width={14} height={12} src="/icon/ic_comment.svg" alt="comment" />
            &nbsp;
            {toShortNum(comment_count)}
          </div>
        </div>
      </div>
    </button>
  );
};
const Style = css`
  border-radius: 10px;
  border: 1px solid #272742;
  background: #21212d;
  width: 100%;
  height: max-content;

  padding: 12px 10px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .content {
    word-break: break-all;
    text-align: left;
    height: fit-content;
  }
  .like {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .tag-list {
    display: flex;
    gap: 3px;
  }
  .date {
    display: flex;
    align-items: center;
    white-space: pre;
  }
  .view {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-right: 4px;
  }
  .comment {
    display: flex;
    align-items: center;
    gap: 1px;
    font-size: 0.5rem;
  }
  .community-title {
    margin-right: 4px;
  }
  .community-title-container {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .community-emoji {
    font-size: 0.923077rem;
    margin-right: 4px;
  }
  .community-left-container {
    display: flex;
    gap: 4px;
  }

  .top {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .middle {
    display: flex;
    min-height: 3rem;

    margin-top: 4px;
  }
  .like-good {
    font-size: 0.5rem;
  }
  .like-percent {
    margin-left: 4px;
    font-size: 0.5rem;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    width: 100%;

    margin-top: 8px;
  }
  .sub-bottom {
    display: flex;
    gap: 9px;
  }
  .red {
    color: #e95151;
  }
  .blue {
    color: #51e97f;
  }
`;
