import { decrypt, encrypt } from "../util/Crypto";

const isServer = typeof window !== "undefined";

export const localStorageEffectSecure =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    if (isServer) {
      const savedValue = localStorage.getItem(`${key}/s`);
      if (savedValue != null) setSelf(JSON.parse(decrypt(savedValue)));
    }
    onSet((newValue: any) => {
      if (isServer) localStorage.setItem(`${key}/s`, encrypt(JSON.stringify(newValue)) + "");
    });
  };
