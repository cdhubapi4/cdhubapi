import Ripple from "@/components/layout/Ripple";
import { SearchFilterTypeState } from "@/components/recoil/SearchFilterTypeState";
import { DecryptFetcher } from "@/components/util/Fetcher";
import { objToURLParams, urlParamsToObj } from "@/components/util/getRouterParamList";
import { UserDataType } from "@/components/util/getUserData";
import { t } from "@/components/util/translate";
import { UserSearchResponse } from "@/pages/api/user-search";
import { searchDataType } from "@/pages/search";
import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import { isAndroid, isIOS } from "react-device-detect";
import Skeleton from "react-loading-skeleton";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import SwipeView from "../SwipeView";
import { ProfileCard } from "../main/ProfileCard";
import { CommunityRoomCard } from "./CommunityRoomCard";
import { TopButton } from "./TopButton";
import useScrollPosition from "@/components/hook/useScrollPosition";

export const CommunitySearch = ({ searchData, userData }: { searchData: searchDataType; userData: UserDataType }) => {
  const router = useRouter();
  const {
    settings: { language },
  } = userData;
  const params = useMemo(() => urlParamsToObj(router.asPath), [router.asPath]);
  const { page, size, sort, created, d, query } = params;
  const currentPageRef = useRef<HTMLInputElement>(null);

  const filterType = useRecoilValue(SearchFilterTypeState);

  const isUserSearch = d === "user" && query.length > 1;
  const { data: userList } = useSWR<UserSearchResponse>(
    !page || !isUserSearch ? undefined : `/api/user-search?q=${query}`,
    DecryptFetcher
  );

  // scroll 저장
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useScrollPosition(scrollContainerRef);

  const goToTop = () => document.getElementById("community-search")?.scrollTo({ top: 0, behavior: "auto" });

  useEffect(() => {
    if (currentPageRef.current && page) currentPageRef.current.value = page;
  }, [router.asPath]);
  return (
    <div css={Style} id="community-search" ref={scrollContainerRef}>
      <section style={{ margin: 0 }}>
        {userList && userList.length > 0 ? (
          <>
            <div className="title" style={{ marginLeft: 10, marginTop: 12 }}>
              {t["유저"][language]}
            </div>
            <div style={{ marginTop: 12 }}>
              <SwipeView fullWidth={false} isInfinity={false} isDot={false} autoPlay={false}>
                {userList.map((u) => (
                  <ProfileCard
                    key={u.nickname}
                    profileEmoji={u.profile_emoji}
                    level={u.level}
                    nickname={u.nickname}
                    userId={u.user_id}
                  />
                ))}
              </SwipeView>
            </div>
          </>
        ) : null}
        <div className="title-container">
          <div className="title" style={{ marginLeft: 10 }}>
            {t["전체 쪽지"][language]}
          </div>
          <div>
            <select
              className="sub-btn"
              onChange={({ target: { value } }) => {
                const created = value;
                const obj = urlParamsToObj(router.asPath);
                if (obj.created === created) return;
                obj.page = "1";
                obj.created = created;
                router.push(`/search?${objToURLParams(obj)}`);
                goToTop();
              }}
              value={created}
            >
              <option value="all">{t["필터: 전체"][language]}</option>
              <option value="day">{t["필터: 오늘"][language]}</option>
              <option value="week">{t["필터: 이번주"][language]}</option>
              <option value="month">{t["필터: 이번달"][language]}</option>
              <option value="year">{t["필터: 올해"][language]}</option>
            </select>
            <select
              className="sub-btn"
              onChange={({ target: { value } }) => {
                const sort = value;
                const obj = urlParamsToObj(router.asPath);
                if (obj.sort === sort) return;
                obj.page = "1";
                obj.sort = sort;
                router.push(`/search?${objToURLParams(obj)}`);
                goToTop();
              }}
              value={sort}
            >
              <option value="relevance">{t["정렬: 정확도 순"][language]}</option>
              <option value="update">{t["정렬: 최근 갱신순"][language]}</option>
              <option value="new">{t["정렬: 최근 생성순"][language]}</option>
              {filterType !== "index" && <option value="like">{t["정렬: 좋아요 많은순"][language]}</option>}
              {filterType !== "index" && <option value="view">{t["정렬: 조회수 많은순"][language]}</option>}
              {/* <option value="dislike">{t["정렬: 싫어요 많은순"][language]}</option> */}
              {/* <option value="comment">{t["정렬: 댓글 많은순"][language]}</option> */}
            </select>
            <select
              className="sub-btn"
              onChange={({ target: { value } }) => {
                const size = value;
                const obj = urlParamsToObj(router.asPath);
                if (obj.size === size) return;
                obj.page = "1";
                obj.size = size;
                router.push(`/search?${objToURLParams(obj)}`);
                goToTop();
              }}
              value={size}
            >
              <option value="10">{t["10개씩 보기"][language]}</option>
              <option value="15">{t["15개씩 보기"][language]}</option>
              <option value="20">{t["20개씩 보기"][language]}</option>
            </select>
          </div>
        </div>
      </section>
      <section style={{ gap: 12, display: "flex", flexDirection: "column", margin: "0 10px" }}>
        {searchData && searchData.roomList ? (
          searchData.roomList.length === 0 ? (
            <div>검색 결과가 없습니다.</div>
          ) : (
            searchData.roomList.map((room, i) => <CommunityRoomCard room={room} key={i} />)
          )
        ) : (
          Array.from({ length: Number(size) }).map((_, i) => (
            <Skeleton
              key={i}
              count={1}
              borderRadius={10}
              height="130px"
              baseColor="#21212D"
              highlightColor="#2C2C36"
              style={{ border: "1px solid #272742" }}
            />
          ))
        )}
      </section>
      <nav css={NavStyle} style={{ paddingBottom: isIOS ? 240 : 160 }}>
        <div />
        <div className="nav" style={{ flex: 1 }}>
          <button
            className="nav button-default message-title"
            onClick={() => {
              const obj = urlParamsToObj(router.asPath);
              if (obj.page === "1") return;
              obj.page = "1";
              router.push(`/search?${objToURLParams(obj)}`);
              goToTop();
            }}
            disabled={Number(page) === 1}
          >
            {t["처음"][language]}
            <Ripple />
          </button>

          <button
            className="nav button-default message-title"
            onClick={() => {
              const obj = urlParamsToObj(router.asPath);
              if (obj.page === "1") return;
              obj.page = Number(page) - 1 + "";
              router.push(`/search?${objToURLParams(obj)}`);
              goToTop();
            }}
            disabled={Number(page) === 1}
          >
            {t["이전 페이지"][language]}
            <Ripple />
          </button>

          <div>
            <input
              ref={currentPageRef}
              className="nav message-content"
              maxLength={5}
              onChange={(e) => {
                const num = parseInt(e.target.value.replace(/[^0-9]/g, ""));
                e.target.value = !isNaN(num) ? String(Math.min(num, searchData?.totalPage || 1)) : "";
              }}
              style={{ width: `${Math.max(1, String(searchData?.totalPage).length / 2)}rem`, textAlign: "center" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // ios 키code 입력 필요.
                  const obj = urlParamsToObj(router.asPath);
                  if (obj.page === currentPageRef.current?.value || currentPageRef.current === null) return;
                  obj.page = currentPageRef.current ? parseInt(currentPageRef.current.value) + "" : obj.page;
                  router.push(`/search?${objToURLParams(obj)}`);
                  goToTop();
                }
              }}
              type={isAndroid || isIOS ? "number" : "text"}
              inputMode="numeric"
              pattern="[0-9]*"
              defaultValue={page || 0}
            />
            <span className="nav message-content"> / {searchData?.totalPage || 1}</span>
          </div>

          <button
            className="nav button-default message-title"
            onClick={() => {
              const obj = urlParamsToObj(router.asPath);
              obj.page = Number(page) + 1 + "";
              router.push(`/search?${objToURLParams(obj)}`);
              goToTop();
            }}
            disabled={searchData && Number(page) === searchData.totalPage}
          >
            {t["다음"][language]}
            <Ripple />
          </button>

          <button
            className="nav button-default message-title"
            onClick={() => {
              const obj = urlParamsToObj(router.asPath);
              if (obj.page === String(0) || !searchData) return;
              obj.page = searchData.totalPage + "";
              router.push(`/search?${objToURLParams(obj)}`);
              goToTop();
            }}
            disabled={searchData && Number(page) === searchData.totalPage}
          >
            {t["마지막"][language]}
            <Ripple />
          </button>
        </div>
      </nav>
      <TopButton />
    </div>
  );
};

const NavStyle = css`
  display: flex;
  align-items: center;
  margin-top: 24px;

  div.nav {
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
  }
  .page.nav {
    color: white;
    padding: 4px 8px;
    text-align: center;
    margin-right: 8px;
  }
  button.nav {
    padding: 4px 8px;
    height: fit-content;
  }
`;
const Style = css`
  display: flex;
  width: calc(100%);
  flex-direction: column;
  height: calc(var(--vh) - 20px - 130px + 80px);
  overflow-y: scroll;
  gap: 12px;

  section {
    margin: 0 10px 0 10px;
  }

  .title-container {
    margin: 15px 0 16px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .title {
    color: #fff;
    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif;
    font-size: 0.9230769230769231rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.4px;
  }
  .title-container .sub-btn {
    text-align: right;
    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif;
    font-size: 0.66153846153846156rem;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: -0.4px;

    background: rgb(24, 23, 28);
    border: none;
    outline: none;

    margin-right: 16px;
    text-align: left;
  }
`;
