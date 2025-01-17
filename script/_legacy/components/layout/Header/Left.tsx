import { UserDataType } from "@/components/util/getUserData";
import { t } from "@/components/util/translate";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Ripple from "../Ripple";

export const Left = ({
  type,
  userData,
}: {
  type: "letter" | "back" | "back-home" | "community" | "home" | null;
  userData: UserDataType;
}) => {
  const router = useRouter();

  const {
    settings: { language },
  } = userData;

  if (type === "back") {
    const onClick = () => (window.history.length <= 2 ? router.push("/") : router.back());

    return (
      <button className="header-left" onClick={onClick} style={{ marginLeft: 0 }}>
        <div style={{ minWidth: 46 - 12, padding: "5px 0" }}>
          <div className="header-back">
            <Image width={8} height={16} src="/icon/back_arrow.svg" alt="back" />
            <div style={{ marginTop: 1 }}>{t["이전"][language]}</div>
          </div>
        </div>
        <Ripple />
      </button>
    );
  }
  if (type === "back-home") {
    const onClick = () => router.push("/");

    return (
      <button className="header-left" onClick={onClick} style={{ marginLeft: 0 }}>
        <div style={{ minWidth: 46 - 12, padding: "5px 0" }}>
          <div className="header-back">
            <Image width={8} height={16} src="/icon/back_arrow.svg" alt="back" />
            <div style={{ marginTop: 1 }}>{t["이전"][language]}</div>
          </div>
        </div>
        <Ripple />
      </button>
    );
  }
  if (type === "community") {
    const metaTitle = "랜덤채팅 | 스페이스챗";
    return (
      <>
        <Head>
          <title>{metaTitle}</title>
          <meta property="og:title" content={metaTitle} />
        </Head>
        <button className="header-left" onClick={() => router.push("/community")} style={{ marginLeft: 10 }}>
          <div style={{ minWidth: 46 - 12, padding: "5px 0" }}>
            <div className="header-back">
              <div style={{ marginTop: 1 }}>
                {language === "KR" ? (
                  <>
                    커뮤
                    <br />
                    니티
                  </>
                ) : language === "US" ? (
                  <>Community</>
                ) : null}
              </div>
            </div>
          </div>
          <Ripple />
        </button>
      </>
    );
  }

  if (type === "letter") {
    const metaTitle = "커뮤니티 | 스페이스챗";
    return (
      <>
        <Head>
          <title>{metaTitle}</title>
          <meta property="og:title" content={metaTitle} />
        </Head>
        <button className="header-left" onClick={() => router.push("/")} style={{ marginLeft: 10 }}>
          <div style={{ minWidth: 46 - 12, padding: "5px 0" }}>
            <div className="header-back">
              <div style={{ marginTop: 1 }}>
                {language === "KR" ? (
                  <>
                    랜덤
                    <br />
                    채팅
                  </>
                ) : language === "US" ? (
                  <>
                    Random
                    <br />
                    Chat
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <Ripple />
        </button>
      </>
    );
  }
  if (type === "home") {
    const onClick = () => router.push("/community");

    return (
      <button className="header-left" onClick={onClick} style={{ marginLeft: 0 }}>
        <div style={{ minWidth: 46 - 12, padding: "5px 0" }}>
          <div className="header-back">
            <Image width={8} height={16} src="/icon/back_arrow.svg" alt="back" />
            <div style={{ marginLeft: 4 }}>{t["전체 목록"][language]}</div>
          </div>
        </div>
        <Ripple />
      </button>
    );
  }
  return null;
};
