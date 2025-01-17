import { isApp } from "@/components/util/constant";
import { UserDataType } from "@/components/util/getUserData";
import axios from "axios";
import OneSignal from "react-onesignal";

export const addWebpush = (user: UserDataType, onesignalToken?: string, onesignalId?: string) => {
  const { userAgent } = navigator;
  const getBrowserName = () => {
    if (userAgent.includes("Chrome")) return "chrome";
    else if (userAgent.includes("Firefox")) return "firefox";
    else if (userAgent.includes("Safari")) return "safari";
    else if (userAgent.includes("Edge")) return "edge";
    else if (userAgent.includes("Opera")) return "opera";
    else return "unknown";
  };
  const token = onesignalToken || OneSignal.User.PushSubscription.token;
  const onesignal_id = onesignalId || OneSignal.User.PushSubscription.id;
  const platform = isApp ? (userAgent.includes("Android") ? "android" : "ios") : "web"; // 예: "web", "android", "ios" 등
  const browser = getBrowserName();
  const user_agent = userAgent; // 현재 사용 중인 브라우저의 User-Agent
  const location = user.settings.country;

  return axios
    .post("/api/user-webpush-add", { token, platform, browser, user_agent, location, onesignal_id })
    .catch(() => console.error("Error saving device info"));
};
export const removeWebpush = (onesignal_id: string | null | undefined) => {
  if (!onesignal_id) return console.error("Error deleting device info");
  return axios
    .delete(`/api/user-webpush-delete-device?onesignal_id=${onesignal_id}`)
    .catch(() => console.error("Error deleting device info"));
};
export const disableWebpush = (onesignal_id: string | null | undefined) => {
  if (!onesignal_id) return console.error("Error deleting device info");
  return axios
    .patch(`/api/user-webpush-disable-device?onesignal_id=${onesignal_id}`)
    .catch(() => console.error("Error deleting device info"));
};
export const activeWebpush = (onesignal_id: string | null | undefined) => {
  if (!onesignal_id) return console.error("Error deleting device info");
  return axios
    .patch(`/api/user-webpush-active-device?onesignal_id=${onesignal_id}`)
    .catch(() => console.error("Error deleting device info"));
};
