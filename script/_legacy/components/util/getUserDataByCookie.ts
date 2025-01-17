import { decrypt } from "@/components/util/Crypto";
import { UserDataType } from "./getUserData";

/**
 * 쿠키 문자열에서 'key' 쿠키를 찾아 복호화된 값을 반환합니다.
 * @param cookieStr - 쿠키 문자열
 * @returns 복호화된 사용자 데이터 또는 null
 */

export function getUserDataByCookie(cookieStr: string | undefined): UserDataType | null {
  if (!cookieStr || !cookieStr.includes("key=")) return null;

  // 'key' 쿠키 값 추출
  const cookie = cookieStr.split("; ").find((row) => row.startsWith("key="));
  if (cookie) {
    const value = cookie.split("=")[1];
    try {
      const decryptedValue = decrypt(value);
      // 숫자로만 구성된 문자열인지 검사
      return decryptedValue;
    } catch (error) {
      console.error("쿠키 복호화 실패:", error);
    }
  }
  return null;
}
