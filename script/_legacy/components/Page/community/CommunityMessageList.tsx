import { decrypt } from "@/components/util/Crypto";
import { isApp } from "@/components/util/constant";
import { UserDataType } from "@/components/util/getUserData";
import { t } from "@/components/util/translate";
import { getKoreanDateTime } from "@/pages/_app";
import { CommentType } from "@/pages/api/thread-public-read-comment";
import { css } from "@emotion/react";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import useSWR from "swr";
import { CommentCard } from "../chat/CommentCard";
import { MessageCard } from "../chat/MessageCard";
import { MessageListStyle, MessageType } from "../chat/MessageList";
import { BottomSheet } from "./BottomSheet";
import { CommunityRoomType } from "./CommunityRoomList";
import { CommunityTextarea } from "./CommunityTextarea";
import { LikeSection } from "./LikeSection";
import { TopButton } from "./TopButton";

export const CommunityMessageList = ({ userData }: { userData: UserDataType }) => {
  const router = useRouter();
  const {
    profile_emoji,
    user_id,
    nickname,
    settings: { language },
  } = userData;
  // const [snapIndex, setSnapIndex] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const path = router.asPath;
  const room = path.slice(path.indexOf("?") + 4, path.length);
  const roomDataRouter: CommunityRoomType | null = room ? JSON.parse(decrypt(room)) : null;
  const { data: roomData, mutate: setRoomData } = useSWR<CommunityRoomType>(
    !roomDataRouter ? undefined : `/api/thread-public-read?thread_id=${roomDataRouter.thread_id}`
  );
  const { data: messageList } = useSWR<MessageType[]>(
    !roomDataRouter
      ? undefined
      : `/api/thread-public-read-letter?thread_id=${roomDataRouter.thread_id}&last_index=${roomDataRouter.last_index}`
  );
  const { data: commentList, mutate: mutateComment } = useSWR<CommentType[]>(
    !roomDataRouter ? undefined : `/api/thread-public-read-comment?thread_id=${roomDataRouter.thread_id}`
  );

  const { mutate: setRoomListMyRecent } = useSWR<CommunityRoomType[]>(
    !roomDataRouter ? undefined : `/api/thread-public-read-my-recent`
  );

  useEffect(() => {
    document.body.style.overscrollBehavior = "contain";
    containerRef.current?.scrollTo({ top: 10000000 });
  }, []);

  useEffect(() => {
    const setRecent = async () => {
      // view add
      if (!roomDataRouter) return;
      await axios.post("/api/thread-public-create-my-recent", { thread_id: roomDataRouter.thread_id });
      setRoomListMyRecent();
    };
    setRecent();
  }, []);

  const onSubmit = async (value: string) => {
    if (!value || !roomDataRouter || !roomData || !profile_emoji || !user_id || !nickname) return;
    setRoomData((p) => (p ? { ...p, comment_count: p.comment_count + 1 } : p), false);
    if (commentList) {
      const maxGroupId = Math.max(...commentList.map((p) => p.reply_group_id)) + 1;
      const newComment: CommentType = {
        thread_id: 0,
        title: nickname,
        content: value,
        created_user_id: user_id,
        profile_emoji: profile_emoji,
        like_count: 0,
        dislike_count: 0,
        created_at: getKoreanDateTime(dayjs()).format("YYYY-MM-DD HH:mm:ss"),
        is_content_modified: 0,
        is_like: 0,
        is_dislike: 0,
        comment_id: 0, //temp comment_id
        reply_parent_comment_id: null,
        reply_group_id: maxGroupId,
        reply_group_index: 1,
        child_comment_count: 0,
        deleted_at: null,
      };
      mutateComment((p) => (p ? [newComment, ...p] : p), false);
    }
    await axios.post("/api/thread-public-create-comment", { thread_id: roomDataRouter.thread_id, content: value });
    mutateComment(); //new comment_id update
  };

  //  const onClose = (e: React.MouseEvent<HTMLImageElement>, isUp: boolean) => {
  //    e.stopPropagation();

  //    if (!isUp) {
  //      setSnapIndex(2);
  //      // 위로 댓글 팝업 올리기
  //      const bottomSheetDiv = document.getElementById("bottom-sheet-container");
  //      const contentDiv = document.getElementById("bottom-sheet-content");
  //      if (bottomSheetDiv && contentDiv) {
  //        bottomSheetDiv.style.transform = `translateY(calc(100% - ${window.innerHeight - 100}px))`;
  //        contentDiv.style.height = `calc(var(--vh) - 62px - var(--vh) + ${window.innerHeight - 100}px)`;
  //      }
  //    } else {
  //      setSnapIndex(0);
  //      // 아래로 댓글 팝업 닫기
  //      const bottomSheetDiv = document.getElementById("bottom-sheet-container");
  //      const contentDiv = document.getElementById("bottom-sheet-content");
  //      if (bottomSheetDiv && contentDiv) {
  //        bottomSheetDiv.style.transform = `translateY(calc(100% - ${60}px))`;
  //        contentDiv.style.height = `calc(var(--vh) - 62px - var(--vh) + ${60}px)`;
  //      }
  //    }
  // };

  return (
    <div css={[Style, MessageListStyle]} ref={containerRef} id="community-message-detail">
      <div id="chat-list" style={{ paddingBottom: window.innerHeight / 4 + 100 }}>
        {!messageList ? (
          <Skeleton
            count={1}
            borderRadius={10}
            height={window.innerHeight / 2 + 50}
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
        <LikeSection room={roomData} setRoom={setRoomData} />
      </div>
      <BottomSheet
        onScrollEnd={() => {
          if (containerRef.current) {
            containerRef.current.style.overflowY = "scroll";
            containerRef.current.style.marginRight = "0px";
          }
        }}
        onScrollStart={() => {
          if (containerRef.current) {
            containerRef.current.style.overflowY = "hidden";
            containerRef.current.style.marginRight = "10px";
          }
        }}
        // onChangeIndex={setSnapIndex}
        // onRef={(r) => {
        //   document.getElementById("modal-15")?.scrollIntoView(); // last comment id CommentCard, id={`modal-${i}`}
        // }}
        header={
          <div css={commentTitleStyle}>
            <div>
              {t["댓글"][language]} <span>{roomData?.comment_count}</span>
            </div>
            <div>
              {/* <Image
                width={10}
                height={10}
                style={{ width: "0.7692307692307693rem", height: "0.7692307692307693rem", cursor: "pointer" }}
                src={snapIndex != 0 ? "/icon/cancel.svg" : "/icon/up.svg"}
                alt=""
                onClick={(e) => onClose(e, snapIndex != 0)}
              /> */}
            </div>
          </div>
        }
      >
        <CommunityTextarea onSubmit={onSubmit} />
        <div css={chatCommentListStyle}>
          {commentList ? (
            commentList.map((comment) => (
              <CommentCard
                userData={userData}
                key={comment.reply_group_id + "-" + comment.reply_group_index}
                index={comment.reply_group_id + "-" + comment.reply_group_index}
                comment={comment}
                setComment={mutateComment}
                onDelete={() => setRoomData((p) => (!p ? p : { ...p, comment_count: p.comment_count - 1 }))}
                threadId={roomData?.thread_id}
              />
            ))
          ) : (
            <Skeleton
              count={1}
              borderRadius={10}
              height={100}
              baseColor="#21212D"
              highlightColor="#2C2C36"
              width={"min(570px, 100vw - 30px)"}
              style={{ border: "1px solid #272742" }}
            />
          )}
        </div>
      </BottomSheet>
      <TopButton elementId="community-message-detail" bottom={20} style={{ zIndex: 100 }} />
    </div>
  );
};
export const commentTitleStyle = css`
  display: flex;
  justify-content: space-between;
  padding: 0 21px 15px 12.4px;

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
  font-weight: 700;
  font-size: 0.7692307692307693rem;
  line-height: normal;
  text-align: center;
  letter-spacing: -0.02em;

  color: #d2d2d5;
`;
export const chatCommentListStyle = css`
  margin-left: 11px;
  margin-right: 3px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
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
