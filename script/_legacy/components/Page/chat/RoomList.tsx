import { RoomType } from "@/components/recoil/RoomListState";
import { UserDataType } from "@/components/util/getUserData";
import { css } from "@emotion/react";
import { RoomCard } from "./RoomCard";

type Props = {
  roomList: RoomType[];
  userData: UserDataType;
};
export const RoomList = ({ roomList, userData }: Props) => {
  const { user_id } = userData;
  return (
    <div css={Style}>
      {roomList.map((room, i) => (
        <RoomCard
          userData={userData}
          key={i}
          room={room}
          style={{ marginLeft: 10, opacity: room.last_send_user_id === Number(user_id) ? 0.3 : 1 }}
          index={i}
        />
      ))}
    </div>
  );
};
const Style = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  height: calc(100% - 4px);
  overflow-y: scroll;
  gap: 12px;
  margin: 10px 0 0 0;
  padding-bottom: 20px;
`;
