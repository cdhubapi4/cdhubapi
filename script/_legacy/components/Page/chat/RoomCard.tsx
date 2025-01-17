import { Loader } from "@/components/layout/Loader";
import { RoomType } from "@/components/recoil/RoomListState";
import { encrypt } from "@/components/util/Crypto";
import { css } from "@emotion/react";
import RestoreIcon from "@mui/icons-material/Restore";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { LongPressDetectEvents, useLongPress } from "use-long-press";
import Ripple from "../../layout/Ripple";

import { ModalState } from "@/components/layout";
import { SnackbarState } from "@/components/layout/Snackbar";
import { isApp } from "@/components/util/constant";
import { UserDataType } from "@/components/util/getUserData";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.locale("ko");

type Props = {
  chatCount?: number;
  disabled?: boolean;
  style: CSSProperties;
  index: number;
  room: RoomType;
  userData: UserDataType;
};
export const RoomCard = ({ chatCount, disabled = false, style, index, room, userData }: Props) => {
  const router = useRouter();
  const { user_id } = userData;
  const [isDeleted, setIsDeleted] = useState(false);
  const isLongPress = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const setModal = useSetRecoilState(ModalState);
  const setSnackbar = useSetRecoilState(SnackbarState);

  useEffect(() => {
    setIsDeleted(false);
  }, [room.thread_id]);
  const callback = useCallback(
    async (e: any, { context }: any) => {
      // if (confirm("해당 메세지를 삭제하시겠습니까? \n삭제한 메세지는 복구가 불가능합니다."))
      isLongPress.current = true;
      setIsDeleted(context);
      setIsLoading(false);
    },
    [isDeleted]
  );

  const onDelete = useLongPress(callback, {
    onStart: (e, param: any) => (isLongPress.current = false), //누른것이 시작되면 호출되는 함수
    threshold: 500, // press 시간 /ms 초 단위이다.
    captureEvent: true, // 첫번째 인자로 들어온 callback 함수가 react MouseEvent를 도와주게 설정
    cancelOnMovement: true, // 확실하진않지만 꾹 눌렀다가 옆으로 이동했을때 취소여부 옵션인것같다
    detect: LongPressDetectEvents.BOTH, // pc의 mouse 혹은 mobile touch 둘다가능하게
  });

  if (isDeleted)
    return (
      <button css={Style(disabled)} {...onDelete(false)} style={style}>
        <div className="left" style={{ opacity: 0 }}>
          {room.profile_emoji}
        </div>
        <div className="center">
          <div className="title ellipse-1" style={{ opacity: 0 }}>
            {room.nickname}
          </div>
          <div
            style={{
              height: 10,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              position: "relative",
              top: isLoading ? -10 : -8,
            }}
          >
            {isLoading ? <Loader /> : <RestoreIcon style={{ color: "#d2d2d57e", height: 30, width: 30 }} />}
          </div>
          <div className="desc ellipse-1" style={{ opacity: 0 }}>
            {room.title}
          </div>
        </div>
        <div className="right" style={{ opacity: 0 }}>
          <div className="day">{dayjs(room.modified_at).fromNow()}</div>
          {chatCount && (
            <div className="sub_btn">
              <Image width={8.43} height={8} src="/icon/chat_small_w8.png" alt="" />
              <div className="count">{chatCount}</div>
            </div>
          )}
        </div>
        <Ripple />
      </button>
    );

  return (
    <button
      css={Style(disabled)}
      {...onDelete(true)}
      onClick={() => {
        if (!isLongPress.current)
          router.push(`/message/${room.thread_id * 183}?id=${encrypt(JSON.stringify(room)) + ""}`);
      }}
      style={style}
    >
      <div className="left">{room.profile_emoji}</div>
      <div className="center">
        <div className="top">
          <div className="message-title title ellipse-1">{`#${room.last_index} ${room.nickname}`}</div>
          <div className="sub-text day">{dayjs(room.modified_at).add(9, "hour").fromNow()}</div>
        </div>
        <div className={`message-content desc ellipse-2`}>{room.title}</div>
      </div>
      {/* <div className="right">
        {chatCount && (
          <div className="sub_btn">
            <Image width={8.43} height={8} src="/icon/chat_small_w8.png" alt="" />
            <div className="count">{chatCount}</div>
          </div>
        )}
      </div> */}
      <Ripple />
    </button>
  );
};
const Style = (disabled: boolean) => css`
  opacity: ${disabled ? 0.4 : 1};
  background-color: #21212d;
  padding: 12px 10px;
  display: flex;
  gap: min(2.2222222222222223vw, 8px);
  justify-content: space-between;

  border-radius: 10px;
  border: 1px solid #313144;
  text-align: left;

  /* min-height: 74px; */

  .message-title {
    ${isApp ? "font-size: 1rem;" : ""}
  }
  .message-content {
    ${isApp ? "font-size: 0.7692307692307693rem;" : ""}
  }

  .top {
    display: flex;
    justify-content: space-between;
  }
  .left {
    font-size: 1.153846153846154rem; // 15px

    display: flex;
    align-items: flex-start;
    height: 100%;

    position: relative;
    top: -1px;
  }
  .center {
    flex: 1;
    padding: 3px 0;
    height: 100%;
    margin-top: 4px;
  }
  .right {
    /* width: 30px; */
    padding: 3px 0;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .title {
    flex: 1;
  }
  .desc {
  }
  .day {
  }
  .sub_btn {
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
    font-size: 0.46153846153846156rem; //6px
    line-height: normal; //8px
    text-align: right;
    letter-spacing: -0.4px;
    color: #848484;

    gap: 4px;
    display: flex;
    width: 100%;
    justify-content: flex-end;
    height: 10px;
  }
  .count {
    position: relative;
    top: 2px;
  }
`;
