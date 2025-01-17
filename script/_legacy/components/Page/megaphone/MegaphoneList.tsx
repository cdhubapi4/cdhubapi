import { css } from "@emotion/react";
import { useRouter } from "next/router";
import Ripple from "../../layout/Ripple";

import { UserDataType } from "@/components/util/getUserData";
import { LanguageType, t } from "@/components/util/translate";
import { MegaphoneListType } from "@/pages/api/megaphone-read-my-history";
import { UserFollowListResponse } from "@/pages/api/user-follow-list";
import axios from "axios";
import useSWR from "swr";
import { CommunityRoomCard } from "../community/CommunityRoomCard";
import { CommunityRoomType } from "../community/CommunityRoomList";
import { BlockCard } from "./BlockCard";
import { DefaultCard } from "./DefaultCard";
import { FollowCard } from "./FollowCard";

export const MegaphoneListFetcher = (url: string) => axios.get(url).then((d) => d.data.result as MegaphoneListType);

const getURL = (page: number) => {
  if (page === 8) return `/api/megaphone-read-my-history`;
  if (page === 10) return `/api/thread-public-read-my?type=bookmark`;
  if (page === 11) return `/api/thread-public-read-my?type=like`;
  if (page === 12) return `/api/thread-public-read-my?type=dislike`;
  if (page === 14) return `/api/user-follow-list`;
  if (page === 15) return `/api/user-following-list`;
  if (page === 16) return `/api/user-block-list`;
  return undefined;
};
const getNoListText = (page: number, language: LanguageType) => {
  if (page === 8) return t["확성기 사용 내역이 없습니다"][language];
  if (page === 10) return t["즐겨찾기 내역이 없습니다"][language];
  if (page === 11) return t["좋아요 내역이 없습니다"][language];
  if (page === 12) return t["싫어요 내역이 없습니다"][language];
  if (page === 14) return t["내가 팔로우한 유저가 없습니다"][language];
  if (page === 15) return t["나를 팔로우한 유저가 없습니다"][language];
  if (page === 16) return t["내가 차단한 유저가 없습니다."][language];
  return "";
};
export const MegaphoneList = ({
  userData,
  page,
  isModal,
}: {
  userData: UserDataType;
  page: number;
  isModal: boolean;
}) => {
  const router = useRouter();
  const {
    nickname,
    settings: { language },
  } = userData;

  const { data: dataList, mutate } = useSWR(getURL(page), { dedupingInterval: 1000 });

  return (
    <div css={Style(isModal)} onClick={() => router.back()}>
      <div id="box" style={{ zIndex: 1 }} onClick={(e) => e.stopPropagation()}>
        <div id="list">
          {dataList === undefined ? (
            <div className="empty">loading ...</div>
          ) : dataList.length ? (
            page === 16 ? (
              (dataList as UserFollowListResponse).map((m, i) => (
                <BlockCard
                  userData={userData}
                  key={i}
                  index={i + 1}
                  emoji={m.profile_emoji}
                  nickname={m.nickname}
                  defaultIsBlock={false}
                  userId={m.user_id}
                />
              ))
            ) : [14, 15].includes(page) ? (
              (dataList as UserFollowListResponse).map((m, i) => (
                <FollowCard
                  key={i}
                  userData={userData}
                  index={i + 1}
                  emoji={m.profile_emoji}
                  nickname={m.nickname}
                  defaultIsFollow={page === 14}
                  userId={m.user_id}
                />
              ))
            ) : page === 8 ? (
              (dataList as MegaphoneListType).map((m, i) => (
                <DefaultCard
                  key={m.thread_megaphone_id}
                  index={i + 1}
                  emoji={m.thread_image}
                  nickname={nickname}
                  created_at={m.created_at}
                  title={m.title}
                />
              ))
            ) : (
              dataList.map((room: CommunityRoomType) => <CommunityRoomCard room={room} key={room.title} />)
            )
          ) : (
            <div className="empty">{getNoListText(page, language)}</div>
          )}
        </div>
        <button css={ButtonStyle} className="button-default button-text" onClick={() => router.back()}>
          {t["닫기"][language]}
          <Ripple />
        </button>
      </div>
    </div>
  );
};

const ButtonStyle = css`
  width: calc(100vw - 60px);
  max-width: calc(600px - 60px);

  height: 50px;
  border-radius: 2px;
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  color: #d2d2d5;
`;
const Style = (isModal: boolean) => css`
  visibility: ${isModal ? "visible" : "hidden"};
  opacity: ${isModal ? 1 : 0};
  transition:
    opacity 0.2s,
    visibility 0.2s;

  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  max-width: 600px;
  height: var(--vh);

  position: fixed;
  top: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  #list {
    height: min(600px, 80vh);
    overflow-y: auto;
    gap: 10px;
    display: flex;
    flex-direction: column;
    width: calc(100vw - 60px);
    max-width: 540px;
  }
  #box {
    position: relative;
    display: flex;
    flex-direction: column;
    /* top: min(calc(var(--vh) * -0.05), -10px); */

    background: #18171c;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);
    border-radius: 4px;

    background-color: #18171c;

    padding: 10px;
  }

  .empty {
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
    /* identical to box height, or 125% */

    display: flex;
    align-items: center;
    justify-content: center;
    color: #bbbbbb;

    margin-top: calc(var(--vh) * 0.3);
  }

  .card {
    padding: 10px;
    background-color: #20202e;
    .title {
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
      /* identical to box height, or 125% */

      display: flex;
      align-items: center;

      color: #bbbbbb;
    }
    .desc {
      margin-top: 8px;

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
      font-size: 0.7692307692307693rem;
      line-height: normal;
      /* identical to box height, or 100% */

      letter-spacing: -0.4px;

      color: #bbbbbb;
    }
  }
`;
