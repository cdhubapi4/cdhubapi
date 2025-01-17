// import SEO from "@/components/layout/SEO";
import { DefaultFetcher } from "@/components/util/Fetcher";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "react-loading-skeleton/dist/skeleton.css";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";
import { PageComponent } from "../components/layout/PageComponent";

import useWindowSize from "@/components/hook/useWindowSize";
import { BASE_URL } from "@/components/util/constant";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect } from "react";
// 플러그인 활성화
dayjs.extend(utc);
dayjs.extend(timezone);

// 로케일과 기본 시간대 설정
dayjs.locale("ko");
dayjs.tz.setDefault("Asia/Seoul");

export const getKoreanDateTime = (time: string | dayjs.ConfigType) => dayjs(time).tz("Asia/Seoul");

export default function App(props: AppProps) {
  axios.defaults.baseURL = BASE_URL;

  useEffect(() => {
    // Service Worker 등록
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          // .then((registration) => console.info("Service Worker enrolled", registration))
          .catch((error) => console.error("Service Worker Failed", error));
      });
    }
  }, []);

  const { height } = useWindowSize();
  // ios, android 등 모바일 기기의 100vh 이슈 해결
  useEffect(() => {
    document.documentElement.style.setProperty("--vh", `${height}px`);
  }, [height]);

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        revalidateOnFocus: false, // 포커스시 재검증 방지 추가
        fetcher: DefaultFetcher, // 기본 fetcher
        dedupingInterval: 3000, // 3초 이내에는 재요청하지 않음
        loadingTimeout: 2000,
        errorRetryCount: 1,
      }}
    >
      <RecoilRoot>
        <PageComponent {...props} />
      </RecoilRoot>
    </SWRConfig>
  );
}
