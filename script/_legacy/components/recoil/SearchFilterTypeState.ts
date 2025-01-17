import { atom } from "recoil";

export const SearchFilterTypeState = atom<"index" | "public">({
  key: "SearchFilterTypeState",
  default: "index",
});
