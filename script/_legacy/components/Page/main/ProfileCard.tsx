import { UserPageParamsType } from "@/components/layout/Header/Center";
import Ripple from "@/components/layout/Ripple";
import { encrypt } from "@/components/util/Crypto";
import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { useState, MouseEventHandler } from "react";
import { isMobile } from "react-device-detect";
import { LevelText } from "./LevelText";

export const ProfileCard = ({
  profileEmoji,
  level,
  nickname,
  userId,
}: {
  profileEmoji: string;
  level: number;
  nickname: string;
  userId: number;
}) => {
  const router = useRouter();

  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!startPoint) return;

    const endX = e.clientX;
    const endY = e.clientY;

    const distance = Math.sqrt((endX - startPoint.x) ** 2 + (endY - startPoint.y) ** 2);

    // 5는 픽셀 단위의 임의의 거리 값이며, 이 값을 조절하여 얼마나 많은 이동을 허용할지 결정할 수 있습니다.
    if (distance > 5) {
      return; // 이동 거리가 너무 크면 클릭 동작을 막습니다.
    }

    e.stopPropagation();
    const params: UserPageParamsType = { user_id: userId, nickname: nickname, profile_emoji: profileEmoji };
    router.push(`/user/${params.user_id}?id=${encrypt(params)}`);
    // router.push(`/#user?id=${encrypt(params)}`);
  };

  return (
    <>
      <div css={ProfileCardStyle}>
        <div className="profileTop">
          <button className="profile" onMouseDown={handleMouseDown} onClick={handleClick}>
            <div>{profileEmoji}</div>
            <Ripple />
          </button>
          <div className="level">
            <LevelText level={level} isLogin />
          </div>
        </div>
        <div className="message-content" style={{ marginTop: 4, color: "white" }}>
          {nickname}
        </div>
      </div>
    </>
  );
};
const ProfileCardStyle = css`
  user-select: none;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  .profileTop {
    /* height: fit-content; */
    /* position: relative; */
    /* top: -60px; */
    .profile {
      width: 64px;
      height: 64px;

      font-size: 46px;
      line-height: normal;

      outline: 4px #393939 solid;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      background-color: rgb(32, 32, 44);
      border: #272727 4px solid;
      box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.4);

      margin-top: 4px;
      & > div {
        position: relative;
        top: ${isMobile ? "0px" : "-2px"};
      }
    }
  }
  .level {
    display: flex;
    justify-content: center;
    height: 10px;
    p {
      position: relative;
      top: -22px;
    }
  }
`;
