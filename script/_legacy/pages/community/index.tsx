import { CommunityRoomList } from "@/components/Page/community/CommunityRoomList";
import { Header } from "@/components/layout/Header/Header";
import SEO from "@/components/layout/SEO";
import { UserDataType, getUserData } from "@/components/util/getUserData";
import { css } from "@emotion/react";

export default function Community({ userData }: { userData: UserDataType }) {
  return (
    <>
      <div css={Style} className="container">
        <Header page={9} userData={userData} />
        <SEO />
        <div className="container-inner" style={{ height: "calc(var(--vh) - 60px)" }}>
          <CommunityRoomList userData={userData} />
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context: { req: any; res: any }) {
  const { req, res } = context;
  // 쿠키 검사 및 유저 데이터 추출 & 새 유저 만들기
  const userData = await getUserData(res, req);
  return { props: { userData } };
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
