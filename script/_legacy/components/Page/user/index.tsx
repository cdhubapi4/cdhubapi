import { UserPageParamsType } from "@/components/layout/Header/Center";
import Ripple from "@/components/layout/Ripple";
import { decrypt, encrypt } from "@/components/util/Crypto";
import { UserDataType } from "@/components/util/getUserData";
import { t } from "@/components/util/translate";
import { UserDataReadResponse } from "@/pages/api/user-data-read";
import { getMaxExp } from "@/pages/api/user-level-add-exp";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { LevelText } from "../main/LevelText";
import { SettingContentStyle } from "../main/SettingContent";

//차단하기는 header
type LoadingType = "block" | "follow" | null;

export const UserPage = ({ userData: myData }: { userData: UserDataType }) => {
  const { version } = require("../../../package.json");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<LoadingType>(null);

  const targetUser: (UserPageParamsType & { key: string }) | null = useMemo(() => {
    const path = router.asPath;
    const data = path.slice(path.indexOf("?") + 4, path.length);
    const result = data ? decrypt(data) : null;
    return result ? { ...result, key: encodeURIComponent(encrypt(String(result.user_id)).toString()) } : null;
  }, []);
  const { data: userData, mutate: setUserData } = useSWR<UserDataReadResponse>(
    !targetUser?.user_id ? undefined : `/api/user-data-read?id=${targetUser.key}`
  );
  const { data: userInfoData } = useSWR<{
    gender: "female" | "male" | "none";
    bio: string | null;
  }>(!targetUser?.user_id ? undefined : `/api/user-data-read-info?id=${targetUser.key}`);

  const {
    isPassword,
    settings: { language },
  } = myData;

  const onClickFollow = async (is_follow: boolean) => {
    if (!targetUser) return;
    if (!isPassword) return alert(t["로그인/회원가입이 필요한 기능입니다."][language]);
    setIsLoading("follow");

    if (!is_follow) await axios.post(`/api/user-follow-add?id=${targetUser.key}`);
    else await axios.delete(`/api/user-follow-delete?id=${targetUser.key}`);
    setUserData((p) => (p ? { ...p, is_follow: is_follow ? 0 : 1 } : p));

    setIsLoading(null);
  };

  const onClickBlock = async (is_block: boolean) => {
    if (!targetUser) return;
    if (!isPassword) return alert(t["로그인/회원가입이 필요한 기능입니다."][language]);
    setIsLoading("block");

    if (!is_block) await axios.post(`/api/user-block-add?id=${targetUser.key}`);
    else await axios.delete(`/api/user-block-delete?id=${targetUser.key}`);
    setUserData((p) => (p ? { ...p, is_blocked: is_block ? 0 : 1 } : p));

    setIsLoading(null);
  };

  return (
    <div css={SettingContentStyle}>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <div className="profile">
          <div>{targetUser?.profile_emoji}</div>
        </div>
      </div>
      {/* {userData ? (
        <>
          <div id="level">
            <LevelText level={userData.level} isLogin />
          </div>
          <div
            className="text"
            style={{
              justifyContent: "center",
              position: "relative",
              top: -10,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <progress value={userData.exp} max={getMaxExp(userData.level)} />
            <p style={{ margin: 0 }}>
              EXP {userData.exp} / {getMaxExp(userData.level)}
            </p>
          </div>
        </>
      ) : null} */}
      <div className="text">
        <div>{t["닉네임"][language]}</div>
        <div>{targetUser?.nickname}</div>
      </div>
      {userInfoData ? (
        <div className="text">
          <div>{t["성별"][language]}</div>
          <div>{userInfoData.gender === "female" ? "Female" : userInfoData.gender === "male" ? "Male" : "-"}</div>
        </div>
      ) : null}
      {userInfoData ? (
        <div className="text">
          <div style={{ textAlign: "left", whiteSpace: "pre" }}>{t["소개글"][language]}</div>
          <div className="ellipse-1">{userInfoData.bio || "-"}</div>
        </div>
      ) : null}
      <div className={"setting-row"}>
        <button
          className={`btn ${userData?.is_blocked === 0 ? "btn_important" : "btn_default"} ${
            isLoading === "block" ? "deactive" : "active"
          }`}
          disabled={isLoading === "block"}
          onClick={() => onClickBlock(userData?.is_blocked === 1)}
        >
          <div>{t[userData?.is_blocked === 1 ? "차단해제" : "차단하기"][language]}</div>
          <Ripple />
        </button>
      </div>
      <div className={"setting-row"}>
        <button
          className={`btn ${userData?.is_follow === 1 ? "btn_important" : "btn_default"} ${
            isLoading === "follow" ? "deactive" : "active"
          }`}
          disabled={isLoading === "follow"}
          onClick={() => onClickFollow(userData?.is_follow === 1)}
        >
          <div>{t[userData?.is_follow === 1 ? "언팔로우" : "팔로우하기"][language]}</div>
          <Ripple />
        </button>
        {/* <button className={`btn btn_important `} onClick={onClickSendDM}>
          <div>{t["DM보내기"][language]}</div>
          <Ripple />
        </button> */}
      </div>

      {/* <button className={`btn btn_default`} onClick={() => router.push("#megaphone-write")}>
        <div>{t["공유 쪽지 목록 보기"][language]}</div>
        <Ripple />
      </button>
      <button className={`btn btn_default`} onClick={() => router.push("#megaphone-write")}>
        <div>{t["좋아요한 글 보기"][language]}</div>
        <Ripple />
      </button>
        <button className={`btn btn_default`} onClick={() => router.push("#megaphone-write")}>
        <div>{t["최근 본 글 보기"][language]}</div>
        <Ripple />
      </button> 
      관심 태그 넣기 - 커뮤니티 하단 태그랑 동일 -> 검색 상세로 이동  */}

      <div className="text" style={{ marginTop: 12 }}>
        <div>{t["마지막 활동일"][language]}</div>
        <div>{dayjs(userData?.last_active_at).format("YYYY.MM.DD")}</div>
      </div>
      <div className="text" style={{ marginTop: 12 }}>
        <div>{t["계정 생성일"][language]}</div>
        <div>{dayjs(userData?.created_at).format("YYYY.MM.DD")}</div>
      </div>
      <div className="text" style={{ marginTop: 24 }}>
        <div>{t["앱 버전"][language]}</div>
        <div>
          {/* <button className="updateLog">
            업데이트 로그 | 새 업데이트
            <Ripple />
          </button> */}
          {version}
        </div>
      </div>
      <div className="text">
        <div>{t["국가"][language]}</div>
        <div>{userData?.country}</div>
      </div>
    </div>
  );
};
