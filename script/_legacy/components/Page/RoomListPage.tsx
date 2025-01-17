import { TabIndexState } from "@/pages/message";
import { css } from "@emotion/react";
import axios from "axios";
import { useEffect } from "react";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import useInterval from "../hook/useInterval";
import { OnesignalIdState } from "../layout/PageComponent";
import { SnackbarState } from "../layout/Snackbar";
import { RoomType } from "../recoil/RoomListState";
import { UserDataType } from "../util/getUserData";
import { t } from "../util/translate";
import { RoomList } from "./chat/RoomList";
import { IsWebpushState } from "./main/SettingContent";

export const RoomListState = atom<RoomType[] | null>({
  key: "RoomListState",
  default: null,
});

export const RoomListPage = ({ userData }: { userData: UserDataType }) => {
  const [roomList, setRoomList] = useRecoilState(RoomListState);
  const {
    settings: { refresh_auto },
  } = userData;
  const setSnackbar = useSetRecoilState(SnackbarState);

  // 쪽지리스트 데이터
  const refreshRoomList = async () => {
    const data = await axios.get<{ result: RoomType[] }>(`/api/thread-letter-list-read-my`).then((d) => d.data.result);
    setRoomList(data);
  };
  // 쪽지리스트 새로고침
  useInterval(refreshRoomList, refresh_auto ? 5000 : 1000000000);

  // 알림 여부
  const onesignalId = useRecoilValue(OnesignalIdState);
  const [data, setIsWebpush] = useRecoilState(IsWebpushState);
  const refreshIsWebpush = async (onesignalId: string) => {
    const data = await axios
      .get<{ result: number | null }>(`/api/user-webpush-read-device?onesignal_id=${onesignalId}`)
      .then((d) => d.data.result);
    setIsWebpush(data);
  };
  useEffect(() => {
    if (onesignalId) refreshIsWebpush(onesignalId);
  }, [onesignalId]);

  useEffect(() => {
    refreshRoomList();
    if (!refresh_auto) {
      setSnackbar(t["쪽지 새로고침이 비활성화 상태입니다. [설정] 메뉴에서 활성화시킬 수 있습니다."]["KR"]);
    } else if (data === 0) {
      setSnackbar(t["쪽지 알림이 비활성화 상태입니다. [설정] 메뉴에서 활성화시킬 수 있습니다."]["KR"]);
    }
  }, []);

  if (!roomList) return null;
  if (roomList.length == 0) return <EmptyTextFirst />;

  return <RoomList roomList={roomList} userData={userData} />;
};

const EmptyTextFirst = () => {
  const setTabIndex = useSetRecoilState(TabIndexState);

  return (
    <div css={FontStyle}>
      <span>No Message List</span>새 메세지를 보내보세요!
      <br />
      <button className="blue" onClick={() => setTabIndex(1)}>
        바로가기
      </button>
    </div>
  );
};
const FontStyle = css`
  button {
    :active {
      margin-top: 13px;
      border-bottom-width: 1px;
    }
    margin-top: 11px;
    padding: 8px 51px;
    width: fit-content;
    display: flex;
  }

  .blue {
    border-top: 1px solid #2d2d4a;
    border-right: 1px solid #2d2d4a;
    border-bottom: 4px solid #2d2d4a;
    border-left: 1px solid #2d2d4a;
    background: #3b3bd8;
  }

  span {
    font-family: "KCCPakKyongni";
    line-height: normal;
  }
  color: #e8e8e8;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Noto Sans KR;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.4px;
  text-align: center;
  font-size: 0.8rem;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  /* height: calc(var(--vh) - 130px); */

  margin-top: 91px;
`;
