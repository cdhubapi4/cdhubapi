import { MegaphoneModal } from "@/components/Page/megaphone/MegaphoneModal";
import { useCheckUserData } from "@/components/hook/useCheckUserData";
import Ripple from "@/components/layout/Ripple";
import SEO from "@/components/layout/SEO";
import { UserDataType, getUserData } from "@/components/util/getUserData";
import { css } from "@emotion/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { MegaphoneResponseType, MegaphoneResponseTypeDefault } from "./api/megaphone-read-now";
import VideoPlayer from "@/components/Page/shorts/HLSVideoPlayer";
import CamperestBanner from "@/components/Page/banner/CamperestBanner";

export default function IndexPage({ userData }: { userData: UserDataType }) {
  const router = useRouter();

  const [isModal, setIsModal] = useState(false);
  useEffect(() => setIsModal(router.asPath.includes("#modal")), [router.asPath]);
  useCheckUserData(userData);

  return (
    <>
      <div css={Style} className="container">
        <SEO />
        <div className="container-inner">
          <h1>스페이스챗 : 더좋은 랜덤채팅</h1>
          <MegaphoneText />
          <section css={SectionStyle}>
            <div className="row">
              <button onClick={() => router.push("/message")} className="column blue">
                <img src="/icon/home_send.svg" />
                <p>쪽지보내기</p>
                <Ripple />
              </button>
              <button onClick={() => router.push("/shorts")} className="column red">
                <img src="/icon/home_shorts.svg" />
                <p>숏폼</p>
                <Ripple />
              </button>
            </div>
            <div className="row">
              <button onClick={() => router.push("/community")} className="column">
                <img src="/icon/home_community.svg" />
                <p>커뮤니티</p>
                <Ripple />
              </button>
              <button onClick={() => router.push("/setting")} className="column">
                <img src="/icon/home_setting.svg" />
                <p>내 정보</p>
                <Ripple />
              </button>
            </div>
          </section>
          <footer css={FooterStyle}>
            <CamperestBanner utm_term="home" style={{ marginBottom: 24 }} />
            <div>© Since 2023 space-chat.io, All Rights Reserved.</div>
          </footer>
          <div
            style={{
              position: "fixed",
              height: "var(--vh)",
              visibility: isModal ? "visible" : "hidden",
              opacity: isModal ? 1 : 0,
              transition: "opacity 0.2s ,visibility 0.2s",
            }}
          >
            <MegaphoneModal userData={userData} />
          </div>
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

const FooterStyle = css`
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);

  color: #fff;
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
  font-size: 8px;
  font-style: normal;
  font-weight: 250;
  line-height: 12px; /* 150% */
  letter-spacing: -0.16px;
`;
const SectionStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 4.8vh;
  gap: 12px;
  padding: 0 16px;
  .row {
    display: flex;
    flex-direction: row;
    flex: 1;
    gap: 16px;
  }
  .column {
    background-color: red;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 117px;
    flex-direction: column;
    padding: 17px 0 22px 0;

    border-top: 1px solid #2a2a41;
    border-right: 1px solid #2a2a41;
    border-bottom: 4px solid #2a2a41;
    border-left: 1px solid #2a2a41;
    background: #222232;

    :active {
      margin-top: 3px;
      border-bottom-width: 1px;
    }
  }

  .blue {
    border-top: 1px solid #2d2d4a;
    border-right: 1px solid #2d2d4a;
    border-bottom: 4px solid #2d2d4a;
    border-left: 1px solid #2d2d4a;
    background: #3b3bd8;
  }

  .red {
    border-top: 1px solid #581d1d;
    border-right: 1px solid #581d1d;
    border-bottom: 4px solid #581d1d;
    border-left: 1px solid #581d1d;
    background: #a82828;
  }

  p {
    color: #fff;
    text-align: center;
    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif,
      -apple-system,
      system-ui,
      BlinkMacSystemFont,
      "Segoe UI";
    font-size: 0.8rem;
    font-style: normal;
    font-weight: 500;
    line-height: 0.96rem; /* 120% */
    letter-spacing: -0.2px;
    margin: 12px 0 0 0;
  }

  img {
    width: 16.875vw;
    max-width: 108px;
    height: 16.875vw;
    max-height: 108px;
  }
`;

export const MegaphoneTextState = atom<MegaphoneResponseType | null>({
  key: "MegaphoneTextState",
  default: MegaphoneResponseTypeDefault("KR"),
});

const MegaphoneText = () => {
  const router = useRouter();
  const [megaphoneData, setMegaphoneData] = useRecoilState(MegaphoneTextState);

  useEffect(() => {
    const getData = async () => {
      const data = await axios
        .get<{ result: MegaphoneResponseType }>(`/api/megaphone-read-now?language=${"KR"}`)
        .then((d) => d.data.result);
      setMegaphoneData(data);
    };
    getData();
  }, []);

  const onRefTransition = (div: HTMLDivElement | null) => {
    if (!div) return;
    const containerWidth = Math.min(window.innerWidth, 600) - 32 - 20 - 6 - 24;

    const textWidth = div.clientWidth;

    // 텍스트 너비가 컨테이너 너비를 초과하지 않으면 이동하지 않도록 합니다.
    if (textWidth <= containerWidth) return (div.style.left = "0");

    const transitionWidth = Math.min(textWidth - containerWidth, 300);
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
    <button className="header-center" onClick={() => router.push("#modal")} title="megaphone">
      <img width="20vw" height="20vw" src="/icon/megaphone.svg" alt="megaphone" />
      <div
        className="ellipse-1"
        style={{
          overflow: "hidden",
          display: "flex",
          whiteSpace: "pre",
          width: "100%",
        }}
      >
        <div style={{ position: "relative", left: 0, whiteSpace: "pre" }} ref={onRefTransition}>
          {megaphoneData && megaphoneData.title ? megaphoneData.title.replaceAll("\n", " ") : ""}
        </div>
      </div>
      <Ripple />
    </button>
  );
};
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
    margin-left: 16px;
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
