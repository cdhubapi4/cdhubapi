import axios from "axios";
import { RoomType } from "../recoil/RoomListState";
import { decrypt } from "./Crypto";

export const DefaultFetcher = (url: string) => axios.get(url).then((d) => d.data.result);
export const DecryptFetcher = (url: string) => axios.get(url).then((d) => decrypt(d.data.result));
export const Fetcher =
  <T>(onResponse: (result: T) => any) =>
  (url: string) =>
    axios.get(url).then((d) => onResponse(d.data.result as T));

export const MessageListFetcher = (url: string, roomData: RoomType | null) =>
  axios.get(url).then((d) => {
    if (d.data.result.length > 0) return d.data.result;
    if (!roomData) return [];
    const initialMessage = {
      index: 1,
      content: roomData.title,
      created_at: roomData.created_at,
      nickname: roomData.nickname,
      profile_emoji: roomData.profile_emoji,
    };
    return [initialMessage];
  });
