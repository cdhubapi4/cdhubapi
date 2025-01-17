import { CommunityRoomType } from "@/components/Page/community/CommunityRoomList";
import { RoomType } from "@/components/recoil/RoomListState";
import { SearchFilterTypeState } from "@/components/recoil/SearchFilterTypeState";
import { decrypt, encrypt } from "@/components/util/Crypto";
import { objToURLParams, urlParamsToObj } from "@/components/util/getRouterParamList";
import { UserDataType } from "@/components/util/getUserData";
import { t } from "@/components/util/translate";
import { MegaphoneTextState } from "@/pages";
import { dType } from "@/pages/api/thread-public-read-search";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Ripple from "../Ripple";

export const CenterTextState = atom<{ emoji?: string; text?: string } | null>({
  key: "CenterTextState",
  default: null,
});
export const Center = ({
  type,
  userData,
}: {
  type: "megaphone" | "message-detail" | "community-message-detail" | "search" | "user" | null;
  userData: UserDataType;
}) => {
  const router = useRouter();

  const setFilterType = useSetRecoilState(SearchFilterTypeState);

  useEffect(() => {
    if (type === "search") setFilterType(router.asPath.includes("&d=letter") ? "index" : "public");
  }, []);

  const {
    settings: { language },
  } = userData;

  const searchSelectRef = useRef<HTMLSelectElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [centerText, setCenterText] = useRecoilState(CenterTextState);
  useEffect(() => {
    // getCenterText
    if (type === "message-detail") {
      const path = router.asPath;
      const data = path.slice(path.indexOf("?") + 4, path.length);
      const roomData: RoomType | null = data ? JSON.parse(decrypt(data)) : null;
      if (roomData) setCenterText({ emoji: roomData.profile_emoji, text: roomData.nickname });
    } else if (type === "user") {
      const path = router.asPath;
      const data = path.slice(path.indexOf("?") + 4, path.length);
      const userData: UserPageParamsType | null = data ? decrypt(data) : null;
      setCenterText({ emoji: userData?.profile_emoji, text: userData?.nickname });
    } else if (type === "community-message-detail") {
      const path = router.asPath;
      const data = path.slice(path.indexOf("?") + 4, path.length);
      const communityRoomData: CommunityRoomType | null = data ? JSON.parse(decrypt(data)) : null;
      setCenterText({ emoji: communityRoomData?.profile_emoji, text: communityRoomData?.title });
    } else if (type === "search") {
      const { page, size, sort, created, d, query } = urlParamsToObj(router.asPath);
      const dList = {
        title: 0,
        letter: 1,
        tag: 2,
        user: 3,
      };
      if (searchSelectRef.current) searchSelectRef.current.selectedIndex = dList[d as dType];
      if (searchInputRef.current && query) searchInputRef.current.value = query;
    }
  }, [router.asPath]);

  const megaphoneData = useRecoilValue(MegaphoneTextState);

  if (type === "message-detail" || type === "community-message-detail" || type === "user") {
    const label = type === "message-detail" ? "내쪽지" : type === "community-message-detail" ? "커뮤니티" : "유저";
    const metaTitle = `${centerText?.emoji} ${centerText?.text} | ${label} | 스페이스챗`;
    return (
      <>
        <Head>
          <title>{metaTitle}</title>
          <meta property="og:title" content={metaTitle} />
        </Head>
        <button
          className="header-center"
          // disabled
          disabled={!centerText || centerText.text === "Deleted User" || type === "user"}
          onClick={() => {
            const path = router.asPath;
            const data = path.slice(path.indexOf("?") + 4, path.length);
            const roomData: RoomType | null = data ? JSON.parse(decrypt(data)) : null;
            if (!roomData || !roomData.other_user_id) return;

            const params: UserPageParamsType = {
              user_id: roomData.other_user_id,
              nickname: roomData.nickname,
              profile_emoji: roomData.profile_emoji,
            };
            // router.push(`/#user?id=${encrypt(params)}`);
            router.push(`/user/${params.user_id}?id=${encrypt(params)}`);
          }}
        >
          <div className="ellipse-1" style={{ justifyContent: "center", width: "100%", position: "relative" }}>
            <span style={{ fontSize: "0.9230769230769231rem", marginRight: 4 }}>{centerText?.emoji}</span>
            <span style={{ position: "relative", top: -1 }}>{centerText?.text}</span>
          </div>
        </button>
      </>
    );
  }

  if (type === "megaphone") {
    const onRefTransition = (div: HTMLDivElement | null) => {
      if (!div) return;
      const contentWidth = Math.min(window.innerWidth, 600) - 120;
      const textWidth = div.clientWidth;
      if (textWidth < contentWidth) return;
      const transitionWidth = Math.min(textWidth - contentWidth, 300);
      div.style.transition = `left linear ${transitionWidth / 20}s 1s`;

      // 두 함수 무한반복
      const f1 = () => {
        if (div) div.style.left = `-${transitionWidth}px`;
        setTimeout(f2, (transitionWidth / 20) * 1000 + 1000);
      };
      const f2 = () => {
        if (div) div.style.left = "0";
        setTimeout(f1, (transitionWidth / 20) * 1000 + 1000);
      };
      f1();
    };

    return (
      <button className="header-center" onClick={() => router.push("#modal")}>
        <img width="0.7692307692307693rem" height="0.7692307692307693rem" src="/icon/megaphone.svg" alt="megaphone" />
        <div
          className="ellipse-1"
          style={{
            overflow: "hidden",
            display: "flex",
            whiteSpace: "pre",
            maxWidth: 480,
          }}
        >
          <div style={{ position: "relative", left: 0, whiteSpace: "pre" }} ref={onRefTransition}>
            {megaphoneData && megaphoneData.title ? megaphoneData.title.replaceAll("\n", " ") : ""}
          </div>
        </div>
        <Ripple />
      </button>
    );
  }

  if (type === "search") {
    const goToTop = () => document.getElementById("community-search")?.scrollTo({ top: 0, behavior: "auto" });
    const obj = urlParamsToObj(router.asPath);
    const metaTitle = `${obj.query || "전체"} | 검색결과 | 스페이스챗`;
    return (
      <>
        <Head>
          <title>{metaTitle}</title>
          <meta property="og:title" content={metaTitle} />
        </Head>
        <div className="header-center" style={{ padding: 0, gap: 8 }}>
          <select
            ref={searchSelectRef}
            className="sub-btn header-center"
            id="search-select"
            style={{ flex: "none", width: "max-content", borderLeft: "none", height: "100%", margin: 0 }}
            onChange={(e) => setFilterType(e.target.value === "letter" ? "index" : "public")}
          >
            <option value="title">{t["필터:제목"][language]}</option>
            <option value="letter">{t["필터:쪽지내용"][language]}</option>
            <option value="tag">{t["필터:태그"][language]}</option>
            <option value="user">{t["필터:유저"][language]}</option>
          </select>
          <input
            ref={searchInputRef}
            className="header-center"
            id="search-input"
            style={{ height: "100%", border: "none", padding: 0, borderRight: "none" }}
            placeholder={t["검색어를 입력해주세요"][language]}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const div = e.target as HTMLInputElement;
                // ios 키code 입력 필요.
                const obj = urlParamsToObj(router.asPath);
                const d = searchSelectRef.current?.value as dType;

                if (obj.d === d && obj.query === div.value) return;

                obj.d = d;
                obj.page = "1";
                obj.query = div.value;
                router.push(`/search?${objToURLParams(obj)}`);

                goToTop();
              }
            }}
          />
        </div>
      </>
    );
  }
  return null;
};

export type UserPageParamsType = {
  user_id: number;
  nickname: string;
  profile_emoji: string;
};
