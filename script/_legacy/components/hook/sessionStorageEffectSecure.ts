import { decrypt, encrypt } from "../util/Crypto";

const isServer = typeof window !== "undefined";

export const sessionStorageEffectSecure =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    if (isServer) {
      const savedValue = sessionStorage.getItem(`${key}/s`);
      if (savedValue != null) setSelf(JSON.parse(decrypt(savedValue)));
    }
    onSet((newValue: any) => {
      if (isServer) sessionStorage.setItem(`${key}/s`, encrypt(JSON.stringify(newValue)) + "");
    });
  };
