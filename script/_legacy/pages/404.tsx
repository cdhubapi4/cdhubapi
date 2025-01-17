import DinoGame from "@/components/Page/game/DinoGame";
import SEO from "@/components/layout/SEO";
import { css } from "@emotion/react";
import { useRouter } from "next/router";

export default function NoPage() {
  const router = useRouter();

  return (
    <>
      <SEO />
      <section css={ErrorSection}>
        <div css={ErrorM} style={{ marginTop: "max(5vh, 40px)" }}>
          404
        </div>
        <div css={ErrorM}>Page Not Found</div>
        <div
          style={{
            display: "flex",
            width: "min(100vw - 80px, 520px)",
            gap: 20,
            marginTop: 30,
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => router.replace("/")}
            css={ButtonStyle}
            style={{
              background: "#696969",
              // margin: "30px 0 10px 0",
              fontWeight: "bold",
            }}
          >
            go to Home
          </button>
          <button
            onClick={() => (window.history.length > 1 ? router.back() : router.replace("/"))}
            css={ButtonStyle}
            style={{
              background: "#447ef2",
              margin: "0",
              fontWeight: "bold",
            }}
          >
            Back
          </button>
        </div>
        <div style={{ marginTop: 60, width: "min(580px, calc(100vw - 20px))" }}>
          <DinoGame />
        </div>
      </section>
    </>
  );
}

const ErrorSection = css`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  text-align: center;
  height: 100vh;
`;

const ErrorM = css`
  margin: 0 0 10px 0;
  font-style: normal;
  font-weight: 600;
  font-size: 21px;
  line-height: normal;
  text-align: center;
  letter-spacing: -0.03em;
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
