import { css } from "@emotion/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { OnesignalIdState } from "@/components/layout/PageComponent";
import Ripple from "@/components/layout/Ripple";
import { RoomType } from "@/components/recoil/RoomListState";
import { BASE_URL, isApp, isPWA } from "@/components/util/constant";
import { UserDataType } from "@/components/util/getUserData";
import { LanguageType, t } from "@/components/util/translate";
import { emojiList2 } from "@/pages/api/user-emoji";
import dayjs from "dayjs";
import OneSignal from "react-onesignal";
import useSWR from "swr";
import { activeWebpush, addWebpush, disableWebpush, removeWebpush } from "./webpush";
import { RoomListState } from "../RoomListPage";

type LoadingType =
  | "language"
  | "refresh_auto"
  | "dark_mode"
  | "alram"
  | "block_overseas_ip"
  | "sent_letter"
  | "block_new_letter"
  | "logout"
  | "login"
  | "password"
  | "profile_emoji"
  | "nickname"
  | "block_all"
  | "withdraw"
  | null;

export const IsWebpushState = atom<number | null>({
  key: "IsWebpushState",
  default: null,
});

export const SettingContent = ({ userData }: { userData: UserDataType }) => {
  const { version } = require("../../../package.json");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<LoadingType>(null);
  const setRoomList = useSetRecoilState(RoomListState);

  const [user, setUser] = useState<UserDataType>(userData);
  const {
    user_id,
    settings,
    settings: { country, language, refresh_auto, sent_letter, block_new_letter },
    nickname,
    profile_emoji,
    isPassword,
    gender,
    bio,
    created_at,
  } = user;

  const onesignalId = useRecoilValue(OnesignalIdState);
  const [data, setIsWebpush] = useRecoilState(IsWebpushState);
  const refreshIsWebpush = async (onesignalId: string) => {
    const data = await axios
      .get<{ result: number | null }>(`/api/user-webpush-read-device?onesignal_id=${onesignalId}`)
      .then((d) => d.data.result);
    setIsWebpush(data);
  };
  useEffect(() => {
    if (onesignalId) refreshIsWebpush(onesignalId);
  }, [onesignalId]);

  const isWebpush = typeof data === "number";

  const onClickChangeNickname = async () => {
    if (!nickname) return;
    const newNickname = prompt(t["어떤 닉네임으로 변경할까요? (최대 30자)"][language], nickname);
    if (newNickname === nickname) return;
    if (!newNickname) return;
    if (newNickname.length > 30) alert(t["새 닉네임은 30자 이하여야 합니다."][language]);
    if (newNickname.includes("Anonymous")) return alert(t["새 닉네임에는 'Anonymous'를 포함할 수 없습니다."][language]);
    setIsLoading("nickname");

    const { is_nickname } = await axios.get(`/api/user-is_nickname?nickname=${newNickname}`).then((d) => d.data);
    if (is_nickname) alert(t["이미 사용중인 닉네임입니다."][language]);
    else {
      await axios.get(`/api/user-update_nickname?nickname=${newNickname}`);
      setUser((p) => (p ? { ...p, nickname: newNickname } : p));
    }
    setIsLoading(null);
  };

  const onClickChangeProfileEmoji = async () => {
    if (!profile_emoji) return;
    const newProfileEmoji = prompt(
      t["어떤 프로필(이모지)으로 변경할까요? (예:"][language] + emojiList2 + ")",
      profile_emoji
    );
    if (!newProfileEmoji) return;
    if (newProfileEmoji.length > 2) return alert(t["새 이모지는 1개만 가능합니다."][language]);
    setIsLoading("profile_emoji");
    await axios.get(`/api/user-update_profile_emoji?profile_emoji=${newProfileEmoji}`);
    setUser((p) => (p ? { ...p, profile_emoji: newProfileEmoji } : p));
    setIsLoading(null);
  };

  const onClickChangePassword = async () => {
    if (!profile_emoji) return;
    const newPassword = prompt(t["사용할 비밀번호를 설정해주세요 (최소 4자)"][language]);
    if (!newPassword) return;
    if (newPassword.length < 4) return alert(t["비밀번호는 최소 4자입니다."][language]);
    const recheckPassword = prompt(t["다시한번 비밀번호를 입력해주세요"][language]);
    if (recheckPassword != newPassword) return alert(t["비밀번호가 다릅니다. 다시 입력해주세요."][language]);

    setIsLoading("password");
    await axios.get(`/api/user-update_password?password=${newPassword}`);
    setIsLoading(null);
  };

  const onClickSignup = async () => {
    //#region nickname set
    if (!nickname) return;
    const newNickname = prompt(t["사용할 닉네임(아이디)을 입력해주세요. (최대 30자)"][language]);
    if (newNickname === nickname) return;
    if (!newNickname) return;
    if (newNickname.length > 30) alert(t["닉네임은 30자 이하여야 합니다."][language]);
    if (newNickname.includes("Anonymous")) return alert(t["새 닉네임에는 'Anonymous'를 포함할 수 없습니다."][language]);
    const { is_nickname } = await axios.get(`/api/user-is_nickname?nickname=${newNickname}`).then((d) => d.data);
    if (is_nickname) return alert(t["이미 사용중인 닉네임입니다."][language]);
    else {
      await axios.get(`/api/user-update_nickname?nickname=${newNickname}`);
      setUser((p) => (p ? { ...p, nickname: newNickname } : p));
    }
    //#endregion

    //#region password set
    if (!profile_emoji) return;
    const newPassword = prompt(t["사용할 비밀번호를 설정해주세요 (최소 4자)"][language]);
    if (!newPassword) return;
    if (newPassword.length < 4) return alert(t["비밀번호는 최소 4자입니다."][language]);
    const recheckPassword = prompt(t["다시한번 비밀번호를 입력해주세요"][language]);
    if (recheckPassword != newPassword) return alert(t["비밀번호가 다릅니다. 다시 입력해주세요."][language]);

    setIsLoading("password");
    await axios.get(`/api/user-update_password?password=${newPassword}`);
    setUser((p) => (p ? { ...p, isPassword: 1 } : p));
    setIsLoading(null);
  };

  const onClickLogin = async () => {
    const nickname = prompt(t["닉네임을 입력해주세요"][language]);
    if (!nickname) return;
    const password = prompt(t["비밀번호를 입력해주세요"][language]);
    if (!password) return;

    setIsLoading("login");

    const userData = await axios
      .get(`/api/user-login?nickname=${nickname}&password=${password}`)
      .then((d) => d.data.result);
    if (!userData) alert(t["해당 계정이 없습니다. 다시 시도해주세요."][language]);
    else {
      localStorage.clear();
      sessionStorage.clear();
      setUser(userData);
      const onesignal_id = OneSignal.User.PushSubscription.id;
      await activeWebpush(onesignal_id);
      // setIsWebpush(null);
    }

    setIsLoading(null);
  };
  const onClickLogout = async () => {
    const check = confirm(
      t["로그아웃시 닉네임과 비밀번호를 알아야 재로그인이 가능합니다.\n로그아웃 하시겠습니까?"][language]
    );

    if (!check) return;

    setIsLoading("logout");

    // cookie 초기화
    await axios.get(`/api/user-logout`);
    localStorage.clear();
    sessionStorage.clear();

    // remove webpush noti
    const onesignal_id = OneSignal.User.PushSubscription.id;
    setIsWebpush(null);
    await disableWebpush(onesignal_id);

    setIsLoading(null);
    window.location.reload();
  };
  const toggleSettings = async (
    type: "refresh_auto" | "dark_mode" | "block_overseas_ip" | "sent_letter" | "block_new_letter"
  ) => {
    if (!isPassword && type === "refresh_auto") return alert(t["로그인/회원가입이 필요한 기능입니다."][language]);

    setIsLoading(type);

    const result = await axios
      .get(`/api/user-update_settings?type=${type}&value=${settings[type] ? 0 : 1}`)
      .then((d) => d.data.result);

    setIsLoading(null);

    if (!result) return alert(t["네트워크 오류가 발생했습니다."][language]);
    setUser((prev) => {
      return { ...prev, settings: { ...prev.settings, [type]: settings[type] ? 0 : 1 } };
    });
  };
  const toggleSettingsLang = async () => {
    if (!language) return;

    const promptLang = language === "KR" ? "US" : "KR";
    const languagePrompt = prompt(t["변경할 언어를 설정해주세요"][promptLang]) as LanguageType;
    if (!languagePrompt) return;

    if (!["KR", "US"].includes(languagePrompt)) return alert(t["언어 변경은 'US' 또는 'KR'만 가능합니다."][language]);

    setIsLoading("language");
    const result = await axios
      .get(`/api/user-update_settings?type=language&value=${languagePrompt}`)
      .then((d) => d.data.result);
    setIsLoading(null);

    if (!result) return alert(t["네트워크 오류가 발생했습니다."][language]);
    setUser((prev) => ({ ...prev, settings: { ...prev.settings, language: languagePrompt } }));
  };
  const onClickBlockAll = async () => {
    const deleteCheck = prompt(t["모든 채팅 내역을 삭제하려면 '삭제'를 입력해주세요"][language]);
    if (!deleteCheck) return;

    setIsLoading("block_all");
    if (deleteCheck !== t["삭제"][language]) return alert(t["잘못 입력하셨습니다. '삭제'를 입력해주세요."][language]);
    const result = await axios.get(`/api/thread-block-all`).then((d) => d.data.result);
    setIsLoading(null);

    if (!result) return alert(t["네트워크 오류가 발생했습니다."][language]);
    setRoomList([]);

    window.location.reload();
  };

  const onClickWithdraw = async () => {
    const deleteCheck = prompt(t["회원탈퇴를 진행하려면 닉네임을 입력해주세요"][language]);
    if (!deleteCheck) return;
    if (deleteCheck !== nickname) return alert(t["닉네임이 일치하지 않습니다."][language]);

    setIsLoading("withdraw");
    localStorage.clear();
    sessionStorage.clear();
    const result = await axios.get(`/api/user-withdraw`).then((d) => d.data.result);
    setIsLoading(null);

    if (!result) return alert(t["네트워크 오류가 발생했습니다."][language]);
    setRoomList([]);

    window.location.reload();
  };

  const onClickNoti = async () => {
    if (!isApp && !OneSignal.Notifications.isPushSupported())
      return alert(t["알림을 지원하지 않는 브라우저입니다."][language]);
    // if (!isPassword) return alert(t["로그인/회원가입이 필요한 기능입니다."][language]);

    setIsLoading("alram");

    if (isApp) {
      try {
        let onesignalToken = window.Android.getOneSignalPushToken();
        let onesignalId = window.Android.getOneSignalUserId();
        let permission = window.Android.getOneSignalPermission();
        console.info("onesignalToken:", onesignalToken);
        console.info("onesignalId:", onesignalId);
        console.info("permission:", permission);

        if (!permission) {
          await window.Android.requestOneSignalPermission();
          onesignalToken = window.Android.getOneSignalPushToken();
          onesignalId = window.Android.getOneSignalUserId();
          permission = window.Android.getOneSignalPermission();
          console.info("request-onesignalToken:", onesignalToken);
          console.info("request-onesignalId:", onesignalId);
          console.info("request-permission:", permission);
        }

        if (!onesignalToken || !onesignalId) throw Error();

        if (permission) {
          if (!isWebpush) {
            setIsWebpush(1);
            // alert(t["🪐새 쪽지 알림이 허용되었습니다"][language]);
            await addWebpush(user, onesignalToken, onesignalId);
            await setIsWebpush(1);
            await axios.post(`${BASE_URL}/api/user-webpush-send-me`, {
              content: t["🪐새 쪽지 알림이 허용되었습니다"][language],
            });
          } else {
            setIsWebpush(null);
            await removeWebpush(onesignalId);
            await setIsWebpush(null);
            alert(t["🪐새 쪽지 알림 허용이 해제되었습니다"][language]);
          }
        }
      } catch (error) {
        console.error(error);
        alert(t["🪐사이트 알림이 차단되었거나 지원하지 않는 브라우저입니다."][language]);
      }
    } else {
      if (!isWebpush) {
        try {
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error()), 3000));
          await Promise.race([OneSignal.Notifications.requestPermission(), timeoutPromise]);
          const { permission } = OneSignal.Notifications;
          if (permission) {
            setIsWebpush(1);
            // alert(t["🪐새 쪽지 알림이 허용되었습니다"][language]);
            await addWebpush(user);
            await setIsWebpush(1);
            if (!isMobile && !isPWA) {
              new Notification("스페이스챗", { body: t["🪐새 쪽지 알림이 허용되었습니다"][language] });
            } else {
              // 모바일은 axios로 REST API oneSingal 통해서 보내기.
              await axios.post(`${BASE_URL}/api/user-webpush-send-me`, {
                content: t["🪐새 쪽지 알림이 허용되었습니다"][language],
              });
            }
          } else {
            await setIsWebpush(null);
            alert(t["🪐사이트 알림이 차단되었거나 지원하지 않는 브라우저입니다."][language]);
          }
        } catch (error) {
          alert(t["🪐사이트 알림이 차단되었거나 지원하지 않는 브라우저입니다."][language]);
          alert(error);
        }
      } else {
        const onesignal_id = OneSignal.User.PushSubscription.id;
        setIsWebpush(null);
        await removeWebpush(onesignal_id);
        await setIsWebpush(null);
        alert(t["🪐새 쪽지 알림 허용이 해제되었습니다"][language]);
      }
    }
    setIsLoading(null);
  };

  const onClickChangeGender = async () => {
    const prot = prompt(t["성별을 입력해주세요. (남성-M, 여성-F)"][language]);
    if (!prot) return;
    const gender = prot.toUpperCase() as "M" | "F";
    if (!["M", "F"].includes(gender)) return alert(t["올바른 성별을 입력해주세요."][language]);

    const check = confirm(t["한번 정한 성별은 영구적으로 바꿀 수 없습니다."][language]);
    if (!check) return;

    await axios.get(`/api/user-update_gender?gender=${gender}`);
    setUser((p) => (p ? { ...p, gender: gender === "M" ? "male" : "female" } : p));
  };
  const onClickChangeBio = async () => {
    const bio = prompt(t["소개글을 입력해주세요."][language]);
    if (!bio) return;

    await axios.get(`/api/user-update_bio?bio=${bio}`);
    setUser((p) => (p ? { ...p, bio } : p));
  };

  const onCrawling = async () => {
    const url = prompt(
      `가져올 사이트의 URL을 입력해주세요.
현재 지원URL
- https://thredic.com/index.php?document_srl=[id값]

※ 무분별한 크롤링 방지를 위해 본인의 글만 가져와 주세요.
※ 최소 10개의 대화(스레)가 필요합니다.`
    );
    if (!url) return;
    if (!url.includes("https://thredic.com/index.php?document_srl="))
      return alert("지원하는 사이트가 아닙니다. URL을 맞춰주세요.");

    await axios
      .get(`/api/craw-add-thredic?url=${url}`)
      .then(() => alert("성공적으로 가져왔습니다.\n커뮤니티에서 확인해보세요!"))
      .catch(() =>
        alert("사이트 가져오기에 실패했습니다. 해당 글에 내용이 10개 이상인지, 이미 가져온 글이 아닌지 확인해주세요.")
      );
  };

  return (
    <div css={SettingContentStyle}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="profile">
          <div>{profile_emoji}</div>
        </div>
      </div>
      {/* level && exp ? (
        <>
          <div id="level">
            <LevelText level={level} isLogin={!!isPassword} />
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
            <progress value={exp} max={getMaxExp(level)} />
            <p style={{ margin: 0 }}>
              EXP {exp} / {getMaxExp(level)}
            </p>
          </div>
        </>
          ) : null */}

      <div className="text">
        <div>{t["닉네임"][language]}</div>
        <div>{nickname}</div>
      </div>
      <div className="text">
        <div>{t["성별"][language]}</div>
        <div>{gender === "female" ? "Female" : gender === "male" ? "Male" : "-"}</div>
      </div>
      <div className="text">
        <div style={{ textAlign: "left", whiteSpace: "pre" }}>{t["소개글"][language]}</div>
        <div className="ellipse-1">{bio || "-"}</div>
      </div>
      <div className={"setting-row"}>
        <button
          className={`btn btn_default ${isLoading === "nickname" ? "deactive" : "active"}`}
          disabled={isLoading === "nickname"}
          onClick={onClickChangeNickname}
        >
          <div>{t["닉네임 변경"][language]}</div>
          <Ripple />
        </button>
        <button
          className={`btn btn_default ${isLoading === "profile_emoji" ? "deactive" : "active"}`}
          disabled={isLoading === "profile_emoji"}
          onClick={onClickChangeProfileEmoji}
        >
          <div>{t["프로필 이모지 변경"][language]}</div>
          <Ripple />
        </button>
      </div>

      {isPassword ? (
        <div className={"setting-row"}>
          {gender === "none" ? (
            <button
              className={`btn btn_default ${isLoading === "profile_emoji" ? "deactive" : "active"}`}
              disabled={isLoading === "profile_emoji"}
              onClick={onClickChangeGender}
            >
              <div>{t["성별 정하기"][language]}</div>
              <Ripple />
            </button>
          ) : null}
          <button
            className={`btn btn_default ${isLoading === "profile_emoji" ? "deactive" : "active"}`}
            disabled={isLoading === "profile_emoji"}
            onClick={onClickChangeBio}
          >
            <div>{bio ? t["소개글 변경"][language] : t["소개글 쓰기"][language]}</div>
            <Ripple />
          </button>
        </div>
      ) : null}

      <div className={"setting-row"}>
        <button
          className={`btn btn_default ${isLoading === "password" ? "deactive" : "active"}`}
          disabled={isLoading === "password"}
          onClick={isPassword ? onClickChangePassword : onClickSignup}
        >
          <div>{t[isPassword ? "비밀번호 변경" : "회원가입"][language]}</div>
          <Ripple />
        </button>
        {!isPassword ? (
          <button
            className={`btn btn_default ${isLoading === "login" ? "deactive" : "active"}`}
            disabled={isLoading === "login"}
            onClick={onClickLogin}
          >
            <div>{t["로그인"][language]}</div>
            <Ripple />
          </button>
        ) : null}
      </div>

      <button
        className={`btn btn_toggle ${isLoading === "refresh_auto" ? "deactive" : "active"}`}
        disabled={isLoading === "refresh_auto"}
        onClick={() => toggleSettings("refresh_auto")}
        style={{ marginTop: 24, background: isPassword && !refresh_auto ? "rgb(32, 32, 46)" : undefined }}
      >
        <div>{t["자동 새로고침 활성화 (5초)"][language]}</div>
        <div className="text_toggle">{refresh_auto ? "On" : "Off"}</div>
        <Ripple />
      </button>
      <button
        className={`btn btn_toggle ${isLoading === "alram" ? "deactive" : "active"}`}
        disabled={isLoading === "alram"}
        onClick={onClickNoti}
        style={{ background: isPassword && !isWebpush ? "rgb(32, 32, 46)" : undefined }}
      >
        <div>{t["새 쪽지 알림"][language]}</div>
        <div className="text_toggle">{isWebpush === undefined ? "" : isWebpush ? "On" : "Off"}</div>
        <Ripple />
      </button>
      <button
        className={`btn btn_toggle ${isLoading === "sent_letter" ? "deactive" : "active"}`}
        disabled={isLoading === "sent_letter"}
        onClick={() => toggleSettings("sent_letter")}
      >
        <div>{t["답장 보낸 쪽지도 보기"][language]}</div>
        <div className="text_toggle">{sent_letter ? "On" : "Off"}</div>
        <Ripple />
      </button>
      {/* <button
        className={`btn btn_toggle ${isLoading === "block_overseas_ip" ? "deactive" : "active"}`}
        disabled={isLoading === "block_overseas_ip"}
        onClick={() => toggleSettings("block_overseas_ip")}
      >
      
        <div>{t["해외 쪽지 받지 않기"][language]}</div>
        <div className="text_toggle">{block_overseas_ip ? "On" : "Off"}</div>
        <Ripple />
      </button> */}
      <button
        className={`btn btn_toggle ${isLoading === "block_new_letter" ? "deactive" : "active"}`}
        disabled={isLoading === "block_new_letter"}
        onClick={() => toggleSettings("block_new_letter")}
      >
        <div>{t["새 쪽지 받지 않기"][language]}</div>
        <div className="text_toggle">{block_new_letter ? "On" : "Off"}</div>
        <Ripple />
      </button>
      <button
        className={`btn btn_toggle ${isLoading === "language" ? "deactive" : "active"}`}
        disabled={isLoading === "language"}
        onClick={() => toggleSettingsLang()}
      >
        <div>{t["언어 설정"][language]}</div>
        <div className="text_toggle">{language}</div>
        <Ripple />
      </button>
      {/* <button
        className={`btn btn_toggle ${isLoading === "dark_mode" ? "deactive" : "active"}`}
        disabled={isLoading === "dark_mode"}
        onClick={() => toggleSettings("dark_mode")}
      >
        <div>다크모드 켜기</div>
        <div className="text_toggle">{dark_mode ? "On" : "Off"}</div>
        <Ripple />
      </button> */}

      <button
        className={`btn btn_important ${isLoading === "logout" ? "deactive" : "active"}`}
        onClick={() => router.push("#megaphone-write")}
        style={{ marginTop: 24 }}
      >
        <div>{t["확성기 사용하기"][language]}</div>
        <Ripple />
      </button>
      <div className={"setting-row"}>
        <button className="btn btn_dark" onClick={() => router.push("#megaphone-list")}>
          <div>{t["확성기 사용내역"][language]}</div>
          <Ripple />
        </button>
        <button className="btn btn_dark" onClick={() => router.push("#bookmark-list")}>
          <div>{t["즐겨찾기 목록"][language]}</div>
          <Ripple />
        </button>
      </div>
      <div className={"setting-row"}>
        <button className="btn btn_dark" onClick={() => router.push("#like-list")}>
          <div>{t["좋아요 목록"][language]}</div>
          <Ripple />
        </button>
        <button className="btn btn_dark" onClick={() => router.push("#dislike-list")}>
          <div>{t["싫어요 목록"][language]}</div>
          <Ripple />
        </button>
      </div>
      <div className={"setting-row"}>
        <button className="btn btn_dark" onClick={() => router.push("#follow-list")}>
          <div>{t["팔로우 목록"][language]}</div>
          <Ripple />
        </button>
        <button className="btn btn_dark" onClick={() => router.push("#following-list")}>
          <div>{t["팔로잉 목록"][language]}</div>
          <Ripple />
        </button>
        <button className="btn btn_dark" onClick={() => router.push("#block-list")}>
          <div>{t["차단목록"][language]}</div>
          <Ripple />
        </button>
      </div>
      <button
        style={{ marginTop: 24 }}
        className="btn btn_dark btn_translucent"
        onClick={() => {
          const prot = prompt(t["원하는 폰트 수정 크기를 입력해주세요. 숫자(10 - 20)"][language]);
          if (!prot) return;
          const size = Number(prot);
          if (isNaN(size) || size < 10 || size > 20)
            return alert(t["폰트 크기가 형식에 맞지 않습니다. 10과 20사이의 숫자만 입력해주세요."][language]);
          document.documentElement.style.fontSize = `${size}px`;
        }}
      >
        <div>{t["폰트크기 수정"][language]}</div>
        <Ripple />
      </button>
      {language === "KR" ? (
        <button className="btn btn_dark btn_translucent" onClick={onCrawling}>
          <div>외부 커뮤니티 불러오기</div>
          <Ripple />
        </button>
      ) : null}
      <button
        className="btn btn_dark btn_translucent"
        onClick={() => {
          const mailtoLink = `mailto:spacechat-io@proton.me?subject=Spacechat-${user_id}/${profile_emoji}/${nickname}&body=${t["여기에 문의 내용을 입력해주세요."][language]}`;
          window.location.href = mailtoLink;
        }}
      >
        <div>{t["문의하기"][language]}</div>
        <Ripple />
      </button>
      <button
        className="btn btn_dark btn_translucent"
        onClick={() => {
          router.push("/dino-game");
        }}
      >
        <div>{t["크롬 공룡 게임하기"][language]}</div>
        <Ripple />
      </button>

      <button className="btn btn_dark btn_danger btn_translucent" style={{ marginTop: 24 }} onClick={onClickBlockAll}>
        <div>{t["모든 대화내역 삭제"][language]}</div>
        <Ripple />
      </button>
      {isPassword ? (
        <button className="btn btn_dark btn_danger btn_translucent" onClick={onClickWithdraw}>
          <div>{t["회원탈퇴"][language]}</div>
          <Ripple />
        </button>
      ) : null}
      {isPassword ? (
        <button
          className={`btn btn_dark ${isLoading === "logout" ? "deactive" : "active"}`}
          disabled={isLoading === "logout"}
          onClick={onClickLogout}
          style={{ color: "gray" }}
        >
          <div>{t["로그아웃"][language]}</div>
          <Ripple />
        </button>
      ) : null}

      <div className="text" style={{ marginTop: 12 }}>
        <div>{t["계정 생성일"][language]}</div>
        <div>{dayjs(created_at).format("YYYY.MM.DD")}</div>
      </div>
      <div className="text">
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
        <div>{country}</div>
      </div>
    </div>
  );
};

export const SettingContentStyle = css`
  margin-top: 50px;
  .info {
    border-radius: 10px;
    border: 1px gray solid;
    padding: 4px 10px 4px 10px;
    margin-bottom: 20px;

    align-items: flex-start !important;
    div {
      white-space: pre;
      text-align: left;
      height: fit-content;
    }
  }

  #level {
    display: flex;
    justify-content: center;
    height: 10px;
    p {
      position: relative;
      top: -32px;
    }
  }
  .setting-row {
    display: flex;
    gap: 12px;
  }
  .active {
    opacity: 1;
  }
  .deactive {
    opacity: 0.3;
  }
  .updateLog {
    border: #9b289b solid 1px;
    font-size: 0.4rem;
    color: #9b289b;
    padding: 1px 6px;
    margin-right: 8px;
    border-radius: 8px;
    background-color: transparent;
  }
  padding: 4px 10px 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  height: calc(var(--vh) - 20px - 55px);
  overflow-y: scroll;

  .profile {
    width: 60px;
    height: 60px;

    font-size: 46px;
    line-height: normal;

    outline: 4px #393939 solid;
    border-radius: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border: #272727 3px solid;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.4);

    & > div {
      position: relative;
      top: ${isMobile ? "0px" : "-2px"};
    }
  }

  .btn {
    width: 100%;
    justify-content: center;
    padding: 15px 0 13px 0;
    transition: opacity 0.3s ease;
  }

  .btn_important {
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
    font-size: 1rem;
    line-height: normal;
    display: flex;
    align-items: center;
    text-align: center;
    color: #d2d2d5;

    background: #20202e;
    border-radius: 2px;
  }
  .btn_dark {
    color: #d2d2d5;
    text-align: center;
    font-style: normal;
    font-size: 1rem;
    line-height: normal;
    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif;
    font-weight: 300;

    display: flex;
    align-items: center;
    text-align: center;

    border-radius: 2px;
    border: 1px solid #2a2c38;
    background: #1a1a20;
  }

  .text_toggle {
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
    font-size: 0.6153846153846154rem;
    line-height: normal;
    display: flex;
    align-items: center;
    text-align: right;
    letter-spacing: -0.02em;
    color: #d2d2d5;
  }
  .btn_toggle {
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
    font-size: 1rem;
    line-height: normal;
    display: flex;
    align-items: center;
    color: #d2d2d5;

    border-radius: 2px;
    border: 1px solid #2a2c38;
    background: #1a1a20;

    display: flex;
    justify-content: space-between;

    padding-left: 14px;
    padding-right: 17px;
  }
  .btn_default {
    color: #d2d2d5;
    text-align: center;
    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif;
    font-size: 1rem; /* 13px */
    font-style: normal;
    font-weight: 700;
    line-height: normal; /* 12px */

    display: flex;
    align-items: center;
    text-align: center;

    border-radius: 2px;
    border: 1px solid #4c5066;
    background: #242630;
  }
  .text {
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
    font-size: 0.6153846153846154rem;
    line-height: normal;
    display: flex;
    align-items: center;
    text-align: right;
    letter-spacing: -0.02em;
    color: #d2d2d5;

    justify-content: space-between;
    margin-left: 17px;
    margin-right: 10px;
  }

  .btn_danger {
    color: #d00;
    text-align: center;
    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif;
    font-size: 1rem;
    font-style: normal;
    font-weight: 250;
    line-height: normal;
  }
  .btn_translucent {
    border-radius: 2px;
    border: 1px solid #2a2c38;
    background: rgba(36, 38, 48, 0.2) !important;
    opacity: 0.8;
  }
`;
