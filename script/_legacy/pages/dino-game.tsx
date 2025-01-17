import DinoGame from "@/components/Page/game/DinoGame";
import SEO from "@/components/layout/SEO";
import { clipboardCopyV2 } from "@/components/util/clipboardCopy";
import { css } from "@emotion/react";
import { useRouter } from "next/router";

export default function DinoGamePage() {
  const router = useRouter();
  return (
    <>
      <SEO />
      <section css={ErrorSection}>
        <div className="btn">
          space-chat.io
          <br />
          <br />
          dino-games
          <div>
            <button
              onClick={() => clipboardCopyV2(`${router.asPath}/dino`)}
              css={ButtonStyle}
              style={{
                background: "#009e84",
                fontWeight: "bold",
              }}
            >
              Share Dino-game Link
            </button>
            <button
              onClick={() => (window.history.length > 1 ? router.back() : router.replace("/"))}
              css={ButtonStyle}
              style={{
                background: "#696969",
                fontWeight: "bold",
              }}
            >
              Back
            </button>
          </div>
        </div>
        <div style={{ marginTop: 60, width: "min(580px, calc(100vw - 20px))" }}>
          <DinoGame />
        </div>
      </section>
    </>
  );
}

const ErrorSection = css`
  .btn {
    position: fixed;
    top: 32px;
    width: 100%;
    max-width: 500px;
    line-height: normal;
    div {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 32px;
    }
    @media (max-width: 600px) {
      div {
        align-items: center;
        display: flex;
        gap: 10px;
        flex-direction: column;
        justify-content: center;
        margin-top: 32px;
      }
    }
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;

  width: 100%;
  max-width: 600px;
`;

const ButtonStyle = css`
  width: 210px;
  height: 48px;
  box-shadow: none;
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
  font-size: 15px;
  line-height: normal;
`;
