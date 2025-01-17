import { SettingContent } from "@/components/Page/main/SettingContent";
import { useCheckUserData } from "@/components/hook/useCheckUserData";
import SEO from "@/components/layout/SEO";
import { UserDataType, getUserData } from "@/components/util/getUserData";
import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { BackHeader } from "./message";
import { MegaphoneList } from "@/components/Page/megaphone/MegaphoneList";
import { MegaphoneWrite } from "@/components/Page/megaphone/MegaphoneWrite";
export default function SettingPage({ userData }: { userData: UserDataType }) {
  const router = useRouter();
  const path = router.asPath;
  const page = useMemo(() => {
    const route = path.slice(0, path.indexOf("?") === -1 ? path.length : path.indexOf("?"));
    return [
      "/setting", //0
      "/setting#write", //1
      "/setting#setting", //2
      "/setting#community", //3
      "/setting#modal", //4
      "/setting#chat", //5
      "/setting#community-chat", //6
      "/setting#megaphone-write", //7
      "/setting#megaphone-list", //8
      "/setting#search-list", //9
      "/setting#bookmark-list", //10
      "/setting#like-list", //11
      "/setting#dislike-list", //12
      "/setting#user", //13
      "/setting#follow-list", //14
      "/setting#following-list", //15
      "/setting#block-list", //16
    ].indexOf(route);
  }, [path]);

  useCheckUserData(userData);

  return (
    <>
      <div css={Style} className="container">
        <BackHeader />
        <SEO tab="설정 | 스페이스챗" />
        <div className="container-inner" style={{ height: "var(--vh)" }}>
          <SettingContent userData={userData} />
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          height: "var(--vh)",
          justifyContent: "center",
          display: "flex",
          left: 0,
          width: "100vw",
        }}
      >
        <MegaphoneWrite userData={userData} isModal={page === 7} />
        <MegaphoneList userData={userData} isModal={[8, 10, 11, 12, 14, 15, 16].includes(page)} page={page} />
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
