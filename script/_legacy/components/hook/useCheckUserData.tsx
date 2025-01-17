import { UserDataType } from "@/components/util/getUserData";
import axios from "axios";
import { useEffect } from "react";
import { isEqual } from "lodash";
import { PRODUCTION_URL } from "../util/constant";

/** @description 유저 데이터체크 및 재갱신 */
export function useCheckUserData(userData: UserDataType) {
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<{ result: UserDataType | null }>("/api/user-data-read-info-check");
        const checkedUserData = response.data.result;
        if (checkedUserData === null) {
          // localStorage, sessionStorage, key reset
          localStorage.clear();
          sessionStorage.clear();

          window.location.href = PRODUCTION_URL + "/setting";
          alert("정지되었거나 탈퇴된 계정입니다.");
          return;
        }
        if (!isEqual(userData, checkedUserData)) window.location.reload();
      } catch (error) {
        alert("네트워크 오류입니다. 잠시 후에 다시 시도해주세요.");
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);
}
