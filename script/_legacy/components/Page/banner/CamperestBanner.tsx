import { CSSProperties } from "react";

export default function CamperestBanner({ utm_term, style }: { utm_term: string; style?: CSSProperties }) {
  return (
    <button
      style={{ width: "100vw", maxWidth: 600, padding: 0, background: "none", ...style }}
      onClick={() =>
        window.open(
          `https://camperest.kr/app?utm_source=spacechat&utm_medium=button&utm_campaign=app_download&utm_term=${utm_term}`
        )
      }
    >
      <img
        style={{ width: "100%", maxHeight: 180, objectFit: "contain" }}
        alt="ad"
        src="https://4dayworks.s3.ap-northeast-2.amazonaws.com/camp/img/spacechatBanner.png"
      />
    </button>
  );
}
