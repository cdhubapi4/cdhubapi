import Ripple from "@/components/layout/Ripple";
import { Fetcher } from "@/components/util/Fetcher";
import { UserDataType } from "@/components/util/getUserData";
import { t } from "@/components/util/translate";
import { SearchResponseType } from "@/pages/api/thread-public-read-search";
import { css } from "@emotion/react";
import chunk from "lodash/chunk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import useSWR from "swr";
import SwipeView from "../SwipeView";
import { Tag } from "../Tag";
import { CommunityRoomCard } from "./CommunityRoomCard";

export type CommunityRoomType = SearchResponseType;

interface TagType {
  tag: string;
  count: number;
}
interface TagTypeAt extends TagType {
  latest_modified_at: string;
}

export const CommunityRoomList = ({ userData }: { userData: UserDataType }) => {
  const {
    settings: { language },
  } = userData;
  const router = useRouter();

  const { data: roomListHot } = useSWR<CommunityRoomType[]>(`/api/thread-public-read-hot`);
  const { data: roomListRecent } = useSWR<CommunityRoomType[][]>(
    `/api/thread-public-read-recent`,
    Fetcher<CommunityRoomType[]>((d) => chunk(d, 2))
  );
  const { data: roomListMyRecent } = useSWR<CommunityRoomType[]>(`/api/thread-public-read-my-recent`);
  const { data: tagAllList } = useSWR<TagTypeAt[]>(`/api/thread-public-read-tag-all`);
  const { data: tagMyList } = useSWR<TagType[]>(`/api/thread-public-read-tag-my`);
  const [tagSort, setTagSort] = useState<"count" | "letter" | "modified_at" | "random">("count");
  const [sortedTags, setSortedTags] = useState<TagTypeAt[]>([]);

  // set tag sort
  useEffect(() => {
    const sortTags = (list: TagTypeAt[]) => {
      let tagsToSort = [...list];
      switch (tagSort) {
        case "count":
          tagsToSort = tagsToSort.sort((a, b) => b.count - a.count);
          break;
        case "letter":
          tagsToSort = tagsToSort.sort((a, b) => a.tag.localeCompare(b.tag));
          break;
        case "modified_at":
          tagsToSort = tagsToSort.sort(
            (a, b) => new Date(b.latest_modified_at).getTime() - new Date(a.latest_modified_at).getTime()
          );
          break;
        case "random":
          tagsToSort = tagsToSort.sort(() => Math.random() - 0.5);
          break;
        default:
          break;
      }

      setSortedTags(tagsToSort);
    };

    if (tagAllList) sortTags(tagAllList);
  }, [tagAllList, tagSort]);

  const tagMainList = tagAllList ? tagAllList.sort((a, b) => b.count - a.count).slice(0, 20) : [];
  return (
    <div css={Style}>
      <section>
        <div className="title-container">
          <div className="title">{t["주요 태그 TOP 10"][language]}</div>
        </div>
        <div className="tag-container">
          {tagMainList.map((tag) => (
            <Tag key={tag.tag} name={tag.tag} />
          ))}
        </div>
      </section>
      <section style={{ margin: 0 }}>
        <div className="title-container">
          <div className="title" style={{ marginLeft: 10 }}>
            {t["HOT 쪽지 TOP 5"][language]}
          </div>

          <button
            className="sub-btn"
            onClick={() => router.push("/search?page=1&size=10&sort=like&created=week&d=title&query=")}
          >
            {t["전체보기"][language]}
            <Ripple />
          </button>
        </div>
        <SwipeView>
          {roomListHot
            ? roomListHot.map((room) => <CommunityRoomCard room={room} key={room.title} />)
            : Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  count={1}
                  borderRadius={10}
                  height="130px"
                  baseColor="#21212D"
                  highlightColor="#2C2C36"
                  style={{ border: "1px solid #272742" }}
                />
              ))}
        </SwipeView>
      </section>
      <section style={{ margin: 0 }}>
        <div className="title-container">
          <div className="title" style={{ marginLeft: 10 }}>
            {t["최근 새 쪽지"][language]}
          </div>
          <button
            className="sub-btn"
            onClick={() => router.push("/search?page=1&size=10&sort=update&created=all&d=title&query=")}
          >
            {t["전체보기"][language]}
            <Ripple />
          </button>
        </div>
        <SwipeView autoPlay={false}>
          {roomListRecent
            ? roomListRecent.map((roomPair, index) => (
                <div className="gap" key={index}>
                  {roomPair.map((room, idx) => (
                    <CommunityRoomCard key={room.thread_id} room={room} />
                  ))}
                </div>
              ))
            : [
                [[], []],
                [[], []],
                [[], []],
              ].map((roomPair, index) => (
                <div className="gap" key={index}>
                  {roomPair.map((_, idx) => (
                    <Skeleton
                      key={idx + index}
                      count={1}
                      borderRadius={10}
                      height="130px"
                      baseColor="#21212D"
                      highlightColor="#2C2C36"
                      style={{ border: "1px solid #272742" }}
                    />
                  ))}
                </div>
              ))}
        </SwipeView>
      </section>
      <section>
        <div className="title-container">
          <div className="title">{t["최근 본 쪽지"][language]}</div>
        </div>
        <div className="gap">
          {roomListMyRecent ? (
            roomListMyRecent.length === 0 ? (
              <div className="message-title">{t["최근 본 쪽지가 없습니다."][language]}</div>
            ) : (
              roomListMyRecent.map((room) => <CommunityRoomCard key={room.thread_id} room={room} />)
            )
          ) : null}
        </div>
      </section>
      <section>
        <div className="title-container">
          <div className="title">{t["자주보는 태그"][language]}</div>
        </div>
        <div className="tag-container">
          {tagMyList ? (
            tagMyList.length === 0 ? (
              <div className="message-title">{t["자주보는 태그가 없습니다."][language]}</div>
            ) : (
              tagMyList.slice(0, 10).map((tag) => <Tag key={tag.tag} name={tag.tag} count={tag.count} />)
            )
          ) : null}
        </div>
      </section>
      <section style={{ marginBottom: 160 }}>
        <div className="title-container">
          <div className="title">{t["전체 태그"][language]}</div>
          <select className="sub-btn" onChange={(e) => setTagSort(e.target.value as any)}>
            <option value="count">{t["쪽지 많은순"][language]}</option>
            <option value="letter">{t["글자순"][language]}</option>
            <option value="modified_at">{t["최근 생긴 태그순"][language]}</option>
            <option value="random">{t["랜덤"][language]}</option>
          </select>
        </div>
        <div className="tag-container">
          {/* Treemap ?? Tile map, honeycomb ??*/}
          {sortedTags.slice(0, 80).map((tag) => (
            <Tag
              key={tag.tag}
              name={tag.tag}
              // count={tag.count}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const Style = css`
  display: flex;
  width: calc(100%);
  flex-direction: column;
  height: calc(var(--vh) - 20px - 130px + 90px);
  overflow-y: scroll;
  gap: 12px;

  section {
    margin: 0 10px 0 10px;
  }
  .tag-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px 6px;
  }
  .gap {
    display: flex;
    flex-direction: column;
    gap: 12px;
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
  .sub-btn {
    /* color: #848484; */
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

    margin-right: 8px;
  }
`;
