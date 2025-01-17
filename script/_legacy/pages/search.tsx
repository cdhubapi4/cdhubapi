import { CommunityRoomType } from "@/components/Page/community/CommunityRoomList";
import { CommunitySearch } from "@/components/Page/community/CommunitySearch";
import { Header } from "@/components/layout/Header/Header";
import SEO from "@/components/layout/SEO";
import { PRODUCTION_URL } from "@/components/util/constant";
import { getURLParamString } from "@/components/util/getRouterParamList";
import { UserDataType, getUserData } from "@/components/util/getUserData";
import { css } from "@emotion/react";
import axios from "axios";

export default function page({
  searchData,
  title,
  userData,
}: {
  searchData: searchDataType;
  title: string;
  userData: UserDataType;
}) {
  return (
    <>
      <SEO
        title={`${title} | 아카이브 | 스페이스챗`}
        tab={`${title} | 아카이브 | 스페이스챗`}
        desc={searchData.roomList.map((i) => i.title)}
        link={typeof window === "undefined" ? "https://space-chat.io/" : window.location.href}
      />
      <div css={Style} className="container">
        <Header page={9} userData={userData} />
        <div className="container-inner" style={{ height: "calc(var(--vh) - 63px)" }}>
          <CommunitySearch searchData={searchData} userData={userData} />
        </div>
      </div>
    </>
  );
}

const Style = css`
  h1 {
    padding-top: 13px;
    padding-bottom: 13px;
    color: #fff;
    text-align: center;
    font-family: KCCPakKyongni;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .header-center {
    gap: 6px;
    width: calc(100% - 32px);
    /* margin: 0 16px; */
    background-color: #2a2a41;
    display: flex;
    align-items: center;
    padding: 11px 12px 9px 12px;

    color: #d2d2d5;
    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif;
    font-size: 0.6923076923076923rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.7692307692307693rem; /* 111.111% */
    letter-spacing: -0.18px;
  }
`;

export type searchDataType = { roomList: CommunityRoomType[]; totalPage: number };

export async function getServerSideProps(context: any) {
  const { req, res } = context;
  // 쿠키 검사 및 유저 데이터 추출 & 새 유저 만들기
  const userData = await getUserData(res, req);

  const searchData = await axios
    .get<{ result: { roomList: CommunityRoomType[]; totalPage: number } }>(
      `${PRODUCTION_URL}/api/thread-public-read-search?${getURLParamString(context.req.url)}`
    )
    .then((d) => d.data.result);

  return { props: { searchData: searchData, title: context.query.query, userData } };
}
