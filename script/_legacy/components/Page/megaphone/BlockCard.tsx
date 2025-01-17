import { UserPageParamsType } from "@/components/layout/Header/Center";
import { encrypt } from "@/components/util/Crypto";
import { UserDataType } from "@/components/util/getUserData";
import { t } from "@/components/util/translate";
import { css } from "@emotion/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Ripple from "../../layout/Ripple";

export const BlockCard = ({
  index,
  emoji,
  nickname,
  defaultIsBlock,
  userId,
  userData,
}: {
  index: number;
  emoji: string;
  nickname: string | null;
  defaultIsBlock: boolean;
  userId: string;
  userData: UserDataType;
}) => {
  const router = useRouter();
  const [isBlock, setIsBlock] = useState(defaultIsBlock);

  const {
    settings: { language },
  } = userData;

  const onClickBlock = async (is_block: boolean) => {
    const key = encodeURIComponent(encrypt(userId).toString());
    if (!is_block) await axios.post(`/api/user-block-add?id=${key}`);
    else await axios.delete(`/api/user-block-delete?id=${key}`);
    setIsBlock((p) => !p);
  };
  const onClickNickname = () => {
    if (!nickname) return;
    const params: UserPageParamsType = { user_id: Number(userId), nickname: nickname, profile_emoji: emoji };
    router.push(`/user/${params.user_id}?id=${encrypt(params)}`);
    // router.push(`/#user?id=${encrypt(params)}`);
  };
  return (
    <div css={BlockCardStyle} className="card">
      <div className="title" onClick={onClickNickname}>
        #{index} {emoji} {nickname}
      </div>
      <button className="desc" style={{ marginTop: 0, background: "none" }} onClick={() => onClickBlock(!isBlock)}>
        {isBlock ? (
          <div className={"follow-btn"}>{t["차단2"][language]}</div>
        ) : (
          <div className={"unfollow-btn"}>{t["차단해제2"][language]}</div>
        )}
        <Ripple />
      </button>
    </div>
  );
};
const BlockCardStyle = css`
  display: flex;
  justify-content: space-between;
  padding: 0;
  .title {
    cursor: pointer;
    min-width: 200px;
  }
  .desc {
    border-radius: 100px;
    padding: 0;
  }
  .unfollow-btn {
    font-size: 0.7rem;
    background-color: #283147;
    padding: 6px 12px;
    border-radius: 100px;
  }
  .follow-btn {
    font-size: 0.7rem;
    background-color: #35497a;
    padding: 6px 12px;
    border-radius: 100px;
  }
`;
