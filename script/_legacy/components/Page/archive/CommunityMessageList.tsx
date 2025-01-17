import { css } from "@emotion/react";
import { useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { MessageCard } from "../chat/MessageCard";
import { MessageListStyle, MessageType } from "../chat/MessageList";
import { CommunityRoomType } from "../community/CommunityRoomList";
import { isApp } from "@/components/util/constant";

export const CommunityMessageList = ({
  isFocus,
  // thread_id,
  // last_index,
  // roomData,
  messageList,
}: {
  isFocus: boolean;
  thread_id: number;
  last_index: number;
  roomData: CommunityRoomType;
  messageList: MessageType[];
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isFocus) return;
    document.body.style.overscrollBehavior = "contain";
    containerRef.current?.scrollTo({ top: 10000000 });
  }, [isFocus]);

  return (
    <div
      css={[Style, MessageListStyle]}
      ref={(r) => {
        containerRef.current = r;
      }}
      id="community-message-detail"
    >
      <div id="chat-list" style={{ paddingBottom: "calc(25vh + 100px)" }}>
        {!messageList ? (
          <Skeleton
            count={1}
            borderRadius={10}
            height={"calc(50vh + 50px)"}
            baseColor="#21212D"
            highlightColor="#2C2C36"
            width={"min(570px, 100vw - 30px)"}
            style={{ border: "1px solid #272742", marginLeft: 10 }}
          />
        ) : (
          messageList.map((message, i) => (
            <MessageCard key={i} message={message} chatBackgroundColor={i % 2 === 0 ? "#1E1E29" : undefined} />
          ))
        )}
        {/* <LikeSection room={roomData} setRoom={setRoom} /> */}
      </div>
    </div>
  );
};
const Style = css`
  height: calc(var(--vh) - 70px);
  overflow-y: scroll;
  margin: 10px 0 0 0;
  .pad-0 {
    padding-bottom: 0 !important;
  }
  .chat-list {
    background-color: #1a191f;
    padding-bottom: 80px;
    button {
      width: 100%;
      text-align: left;
      background-color: #1a191f;
    }
    .chat {
      padding: 10px;

      .chat-info {
        font-family:
          Spoqa Han Sans Neo,
          -apple-system,
          BlinkMacSystemFont,
          "Malgun Gothic",
          "맑은 고딕",
          helvetica,
          "Apple SD Gothic Neo",
          sans-serif;
        font-style: normal;
        font-weight: 250;
        font-size: 0.6153846153846154rem;
        line-height: normal;
        display: flex;
        align-items: center;
        color: #d2d2d5;
        span {
          margin-left: 4px;
          font-family:
            Spoqa Han Sans Neo,
            -apple-system,
            BlinkMacSystemFont,
            "Malgun Gothic",
            "맑은 고딕",
            helvetica,
            "Apple SD Gothic Neo",
            sans-serif;
          font-style: normal;
          font-weight: 250;
          font-size: 0.6153846153846154rem;
          line-height: normal;
          display: flex;
          align-items: center;
          color: #d2d2d5;
        }
      }
      .chat-message {
        margin-top: 2px;
        background: #20202e;
        border-radius: 2px;
        padding: 10px;

        font-family:
          Spoqa Han Sans Neo,
          -apple-system,
          BlinkMacSystemFont,
          "Malgun Gothic",
          "맑은 고딕",
          helvetica,
          "Apple SD Gothic Neo",
          sans-serif;
        font-style: normal;
        font-weight: 300;
        font-size: 1rem;
        line-height: normal;
        color: #d2d2d5;

        white-space: pre-wrap;
      }
    }
  }

  #send-btn {
    position: relative;
    top: ${isApp ? "-195px" : "-15px"};
    left: min(calc(100vw - 5px - 5px - 8px), calc(600px - 5px - 10px - 8px));
    transform: translate(calc(-100% - 10px), calc(-100% + 5px));
    background-color: #363d4e;
    width: max-content;

    white-space: pre;
    padding: 1% 4%;
    border-radius: 4px;

    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 0.9rem;
    line-height: normal;
    display: flex;
    align-items: center;
    text-align: center;
    color: #d2d2d5;
  }
`;
