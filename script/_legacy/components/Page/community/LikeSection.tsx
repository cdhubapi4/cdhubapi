import { toComma } from "@/components/util/toComma";
import { css } from "@emotion/react";
import axios from "axios";
import useSWR, { KeyedMutator } from "swr";
import { CommunityRoomType } from "./CommunityRoomList";
import Image from "next/image";

export const LikeSection = ({
  room,
  setRoom,
}: {
  room?: CommunityRoomType;
  setRoom: KeyedMutator<CommunityRoomType>;
}) => {
  const { data: isDislike, mutate: setIsDislike } = useSWR<boolean>(
    !room ? undefined : `/api/thread-public-read-dislike?thread_id=${room.thread_id}`
  );
  const { data: isLike, mutate: setIsLike } = useSWR<boolean>(
    !room ? undefined : `/api/thread-public-read-like?thread_id=${room.thread_id}`
  );

  return (
    <div style={{ display: "flex", marginTop: 16 }} css={AnimationStyle}>
      <div style={{ flex: 1 }} />
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          width="33.62"
          height="30"
          src={isLike ? "/icon/ic_like.svg" : "/icon/ic_like_empty.svg"}
          alt="like"
          className={`like-button ${isLike ? "liked" : ""}`}
          style={{ opacity: isLike ? 1 : 0.8 }}
          onClick={async () => {
            if (!room || isLike === undefined) return;
            setIsLike((p) => !p, false);
            setRoom((p) => (p ? { ...p, person_like_count: p.person_like_count + (isLike ? -1 : 1) } : p), false);
            await axios.post(`/api/thread-public-${isLike ? "delete" : "add"}-like`, {
              thread_id: room.thread_id,
            });
            setIsLike();
          }}
        />

        <div className="message-title" style={{ fontSize: "0.9rem", margin: "0 30px 0 6px" }}>
          {toComma(room && room.person_like_count ? room.person_like_count : 0)}
        </div>

        <Image
          width="30.36"
          height="30"
          src={isDislike ? "/icon/ic_dislike.svg" : "/icon/ic_dislike_empty.svg"}
          alt="dislike"
          className={`dislike-button ${isDislike ? "disliked" : ""}`}
          style={{ opacity: isDislike ? 1 : 0.8 }}
          onClick={async () => {
            if (!room || isDislike === undefined) return;
            setIsDislike((p) => !p, false);
            setRoom(
              (p) => (p ? { ...p, person_dislike_count: p.person_dislike_count + (isDislike ? -1 : 1) } : p),
              false
            );
            await axios.post(`/api/thread-public-${isDislike ? "delete" : "add"}-dislike`, {
              thread_id: room.thread_id,
            });
            setIsDislike();
            7;
          }}
        />

        <div className="message-title" style={{ fontSize: "0.9rem", marginLeft: 6 }}>
          {toComma(room ? room.person_dislike_count : 0)}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "right" }}>
        <Image width={16} height={14.76} src="/icon/ic_view.png" alt="view" />

        <div className="message-content" style={{ margin: "0 16px 0 4px" }}>
          {toComma(room ? room.view : 0)}
        </div>
      </div>
    </div>
  );
};

const AnimationStyle = css`
  @keyframes heart-beat {
    0% {
      transform: scale(0.76923077);
    }
    25% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.76923077);
    }
    75% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.76923077);
    }
  }

  .like-button.liked {
    animation: heart-beat 0.5s;
  }

  @keyframes shake {
    0% {
      transform: translate(0.5px, 0.5px) rotate(0deg);
    }
    10% {
      transform: translate(-0.5px, -1px) rotate(-0.5deg);
    }
    20% {
      transform: translate(-1.5px, 0px) rotate(0.5deg);
    }
    30% {
      transform: translate(1.5px, 1px) rotate(0deg);
    }
    40% {
      transform: translate(0.5px, -0.5px) rotate(0.5deg);
    }
    50% {
      transform: translate(-0.5px, 1px) rotate(-0.5deg);
    }
    60% {
      transform: translate(-1.5px, 0.5px) rotate(0deg);
    }
    70% {
      transform: translate(1.5px, 0.5px) rotate(-0.5deg);
    }
    80% {
      transform: translate(-0.5px, -0.5px) rotate(0.5deg);
    }
    90% {
      transform: translate(0.5px, 1px) rotate(0deg);
    }
    100% {
      transform: translate(0.5px, -1px) rotate(-0.5deg);
    }
  }

  .dislike-button.disliked {
    animation: shake 0.5s;
  }
`;
