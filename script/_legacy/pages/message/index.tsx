import { RoomListPage } from "@/components/Page/RoomListPage";
import Tab from "@/components/Page/chat/Tab";
import TabHeader from "@/components/Page/chat/TabHeader";
import { WriteContent } from "@/components/Page/main/WriteContent";
import { PageComponent } from "@/components/layout/PageComponent";
import SEO from "@/components/layout/SEO";
import { UserDataType, getUserData } from "@/components/util/getUserData";
import { css } from "@emotion/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { atom, useRecoilState } from "recoil";

export const TabIndexState = atom({
  key: "TabIndexState",
  default: 0,
});

export default function page({ userData }: { userData: UserDataType }) {
  const [tabIndex, setTabIndex] = useRecoilState(TabIndexState);

  return (
    <div css={Style} className="container">
      <BackHeader />
      <SEO />
      <div className="container-inner">
        <TabHeader tabIndex={tabIndex} setTabIndex={setTabIndex} />
        <Tab tabIndex={tabIndex} setTabIndex={setTabIndex}>
          <div
            style={{
              minHeight: "calc(100vh - 200px)",
              height: "calc(var(--vh) - 120.2px)",
              overflow: "scroll hidden",
            }}
          >
            <RoomListPage userData={userData} />
          </div>
          <div style={{ minHeight: "calc(100vh - 200px)" }}>
            <WriteContent userData={userData} />
          </div>
        </Tab>
      </div>
    </div>
  );
}
export async function getServerSideProps(context: { req: any; res: any }) {
  const { req, res } = context;
  // 쿠키 검사 및 유저 데이터 추출 & 새 유저 만들기
  const userData = await getUserData(res, req);
  return { props: { userData } };
}

export const BackHeader = () => {
  const router = useRouter();
  return (
    <div css={HeaderStyle}>
      <div className="header-left" onClick={router.back}>
        <Image width={8} height={16} src="/icon/back_arrow.svg" alt="back" /> 이전
      </div>
      <div />
      <div />
    </div>
  );
};
const HeaderStyle = css`
  position: fixed;
  top: 16px;
  z-index: 1;
  width: min(100vw, 600px);
  padding-left: 16px;
  font-size: 0.6rem;
  justify-content: space-between;
  display: flex;
  cursor: pointer;
  .header-left {
    gap: 6px;
    align-items: center;
    display: flex;
  }
`;
const Style = css`
  .scroll-container::-webkit-scrollbar {
    display: none; /* 스크롤 바 숨기기 */
  }

  .scroll-container {
    display: flex;
    overflow-x: auto;
  }

  .scroll-item {
    flex: 0 0 auto;
    width: 100%;
  }

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
