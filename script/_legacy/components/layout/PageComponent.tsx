import { Modal } from "@/components/layout";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { atom, useSetRecoilState } from "recoil";
import { isApp } from "../util/constant";
import { Snackbar } from "./Snackbar";

export const OnesignalIdState = atom<string | null>({
  key: "OnesignalIdState",
  default: null,
});

export const PageComponent = ({ Component, pageProps }: AppProps) => {
  const setOnesignalId = useSetRecoilState(OnesignalIdState);

  useEffect(() => {
    const opt = {
      appId: "2ef1f0f8-f131-4881-a0a4-89b396897bec",
      safari_web_id: "web.onesignal.auto.5f8d50ad-7ec3-4f1c-a2de-134e8949294e",
      notifyButton: { enable: false },
      autoResubscribe: true,
      autoRegister: true,
    };
    //if dev
    if (window.location.href.includes("localhost")) return;
    if (!isApp) {
      //if web
      OneSignal.init(opt).then(() => setOnesignalId(OneSignal.User.PushSubscription.id || null));
    } else {
      //if app
      const id = window.Android.getOneSignalUserId();
      if (id) setOnesignalId(id);
      console.info("setOnesignalId:", id);
    }
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Modal />
      <Snackbar />
    </>
  );
};
