import { RoomType } from "@/components/recoil/RoomListState";
import { decrypt } from "@/components/util/Crypto";
import { MessageListFetcher } from "@/components/util/Fetcher";
import { isApp } from "@/components/util/constant";
import { UserDataType } from "@/components/util/getUserData";
import sleep from "@/components/util/sleep";
import { t } from "@/components/util/translate";
import { css } from "@emotion/react";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";
import { RoomListState } from "../RoomListPage";
import { Textarea } from "../main/Textarea";
import { MessageCard } from "./MessageCard";

export type MessageType = {
  index: number;
  content: string;
  created_at: string;
  nickname: string;
  profile_emoji: string;
};

export const MessageList = ({ userData }: { userData: UserDataType }) => {
  const router = useRouter();
  const {
    user_id,
    profile_emoji,
    nickname,
    settings: { sent_letter, language },
  } = userData;
  const path = router.asPath;
  const data = path.slice(path.indexOf("?") + 4, path.length);
  const roomData: RoomType | null = data ? JSON.parse(decrypt(data)) : null;

  const setRoomList = useSetRecoilState(RoomListState);

  const refreshRoomList = async () => {
    const data = await axios.get<{ result: RoomType[] }>(`/api/thread-letter-list-read-my`).then((d) => d.data.result);
    setRoomList(data);
  };

  const { data: messageList, mutate: setMessageList } = useSWR<MessageType[]>(
    !roomData ? undefined : `/api/thread-letter-read?thread_id=${roomData.thread_id}`,
    (url) => MessageListFetcher(url, roomData)
  );

  useEffect(() => {
    setMessageList();
  }, []);
  const onSubmit = async (content: string) => {
    if (!roomData || !content || !messageList) return;

    if (sent_letter) {
      const newRoomData = {
        title: content,
        nickname: nickname || "",
        last_index: roomData.last_index + 1,
        last_send_user_id: Number(user_id || -1),
        profile_emoji: profile_emoji || "",
        modified_at: dayjs().subtract(9, "hour").toISOString(),
      };
      setRoomList((p) =>
        !p
          ? p
          : p
              .map((r) => (r.thread_id == roomData.thread_id ? { ...r, ...newRoomData } : r))
              .sort((a, b) => new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime())
      );
    } else setRoomList((p) => (!p ? p : p.filter((r) => r.thread_id != roomData.thread_id)));

    router.back();

    // send message
    await axios.post(`/api/thread-letter-response${messageList.length === 1 ? "_init" : ""}`, {
      thread_id: roomData.thread_id,
      user_id,
      content,
      last_index: roomData.last_index + 1,
      created_user_id: roomData.created_user_id,
    });
    await sleep(20);
    // refresh message list
    await setMessageList();
    await refreshRoomList();
  };
  const isReply = messageList ? messageList[messageList.length - 1].nickname === nickname : false;
  const isOver = messageList && messageList.length > 300 ? true : false;
  const isLast = messageList && messageList.length === 299 ? true : false;
  return (
    <div css={MessageListStyle} ref={(r) => r?.scrollTo({ top: 10000000 })}>
      <div id="chat-list">
        {!messageList ? (
          <Skeleton
            count={2}
            borderRadius={2}
            height={40}
            baseColor="#21212D"
            highlightColor="#2C2C36"
            width={"min(560px, 100vw - 40px)"}
            style={{ border: "1px solid #272742", marginLeft: 15, marginTop: 24 }}
          />
        ) : (
          messageList.map((message, i) => (
            <MessageCard key={i} message={message} chatBackgroundColor={i % 2 === 0 ? "#1E1E29" : undefined} />
          ))
        )}
      </div>
      <Textarea
        onSubmit={onSubmit}
        disabled={isReply || isOver}
        placeholder={
          isLast
            ? t["마지막 쪽지에요. 쪽지는 한 스레드에 300개까지 제한이 있어요."][language]
            : isOver
              ? t["쪽지가 300개로 꽉 찼습니다. 더 이상 답장을 주고받을 수 없어요."][language]
              : isReply
                ? t["이미 답장을 보낸 쪽지입니다."][language]
                : t["쪽지의 내용을 입력해주세요."][language]
        }
      />
    </div>
  );
};

export const MessageListStyle = css`
  height: calc(var(--vh) - 20px - 30px - 30px);
  overflow-y: scroll;

  #chat-list {
    display: flex;
    flex-direction: column;

    background-color: #1a191f;
    button {
      width: 100%;
      text-align: left;
      background: #1a191f;
      box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.25);

      cursor: auto;
    }
    .chat {
      padding: 8px 10px;

      .chat-info {
        color: #eaeaea;
        font-family:
          Spoqa Han Sans Neo,
          -apple-system,
          BlinkMacSystemFont,
          "Malgun Gothic",
          "맑은 고딕",
          helvetica,
          "Apple SD Gothic Neo",
          sans-serif;
        font-size: 0.61538rem;
        font-style: normal;
        font-weight: 100;
        line-height: normal;

        display: flex;
        align-items: center;
        margin-left: 4px;
        margin-bottom: 4px;
        span {
          margin-left: 8px;
          font-size: 0.46153846153846156rem;
          margin-top: 2px;
          opacity: 0.8;
        }
      }
      .chat-emoji {
        font-size: 0.6923076923076924rem;
        margin: 0 2px 0 4px;
      }
      .chat-message {
        margin-top: 2px;

        border-radius: 2px;
        border: 1px solid #2a2c38;
        background: #20202e;

        padding: 10px;

        color: #ddd;
        font-family:
          Spoqa Han Sans Neo,
          -apple-system,
          BlinkMacSystemFont,
          "Malgun Gothic",
          "맑은 고딕",
          helvetica,
          "Apple SD Gothic Neo",
          sans-serif;
        font-size: 0.69231rem;
        font-style: normal;
        font-weight: 300;
        line-height: normal;

        white-space: pre-wrap;
        word-break: break-word;
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
