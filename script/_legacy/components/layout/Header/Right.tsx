import { RoomListState } from "@/components/Page/RoomListPage";
import { isApp } from "@/components/util/constant";
import { objToURLParams, urlParamsToObj } from "@/components/util/getRouterParamList";
import { UserDataType } from "@/components/util/getUserData";
import { dType } from "@/pages/api/thread-public-read-search";
import axios from "axios";
import emojiRegex from "emoji-regex";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";
import { DefaultModalTemplete, ModalState, SelectModalTemplete } from "..";
import { MessageType } from "../../Page/chat/MessageList";
import { CommunityRoomType } from "../../Page/community/CommunityRoomList";
import { TextareaDefaultStyle } from "../../Page/main/WriteContent";
import { RoomType } from "../../recoil/RoomListState";
import { decrypt, encrypt } from "../../util/Crypto";
import { clipboardCopyV2 } from "../../util/clipboardCopy";
import { t } from "../../util/translate";
import { wordList } from "../../util/wordList";
import Ripple from "../Ripple";
import { CenterTextState, UserPageParamsType } from "./Center";

export const Right = ({
  type,
  userData: myData,
}: {
  type: "message-detail" | "community-message-detail" | "search" | "setting" | "search-icon" | "user" | null;
  userData: UserDataType;
}) => {
  const router = useRouter();

  const {
    settings: { language },
    user_id,
    nickname,
    profile_emoji,
  } = myData;

  const setCenterText = useSetRecoilState(CenterTextState);
  const setModal = useSetRecoilState(ModalState);

  // 방 데이터 가져오기
  const [roomData, setRoomData] = useState<RoomType | null>(null);
  const [communityRoomData, setCommunityRoomData] = useState<CommunityRoomType | null>(null);
  const [userData, setUserData] = useState<UserPageParamsType | null>(null);
  const setRoomList = useSetRecoilState(RoomListState);

  const refreshRoomList = async () => {
    const data = await axios.get<{ result: RoomType[] }>(`/api/thread-letter-list-read-my`).then((d) => d.data.result);
    setRoomList(data);
  };

  const { data: isBookmark, mutate: setIsBookmark } = useSWR<boolean>(
    type != "community-message-detail" || !communityRoomData?.thread_id
      ? undefined
      : `/api/thread-public-read-bookmark?thread_id=${communityRoomData.thread_id}`
  );
  const { data: messageList } = useSWR<MessageType[]>(
    type != "community-message-detail" || !communityRoomData
      ? undefined
      : `/api/thread-public-read-letter?thread_id=${communityRoomData.thread_id}&last_index=${communityRoomData.last_index}`
  );

  // 커뮤니티로 공유하기 데이터
  const submitRef = useRef({ title: "", main_index: 1, tag: "" });

  useEffect(() => {
    if (type === "message-detail") {
      const path = router.asPath;
      const data = path.slice(path.indexOf("?") + 4, path.length);
      const roomData: RoomType | null = data ? JSON.parse(decrypt(data)) : null;
      setRoomData(roomData);
    } else if (type === "community-message-detail") {
      const path = router.asPath;
      const data = path.slice(path.indexOf("?") + 4, path.length);
      const communityRoomData: CommunityRoomType | null = data ? JSON.parse(decrypt(data)) : null;
      setCommunityRoomData(communityRoomData);
    } else if (type === "user") {
      const path = router.asPath;
      const data = path.slice(path.indexOf("?") + 4, path.length);
      const userData: UserPageParamsType | null = data ? decrypt(data) : null;
      setUserData(userData);
    }
  }, [router.asPath]);

  if (type === "setting")
    return (
      <button
        className="header-right"
        style={{
          opacity: 1,
          visibility: "visible",
          minWidth: 46,
          marginRight: 10,
        }}
        onClick={() => router.push("/setting")}
      >
        <div style={{ padding: "5px 0" }}>{t["설정"][language]}</div>
        <Ripple />
      </button>
    );
  if (type === "message-detail") {
    const modalBtnList: [title: string, onClick: () => void][] = [
      [
        t["💣 쪽지 삭제"][language],
        async () => {
          const check = confirm(t["정말로 쪽지를 삭제하시겠습니까?"][language]);
          if (!check) return;

          if (roomData) await axios.get(`/api/thread-block-add?user_id=${user_id}&thread_id=${roomData?.thread_id}`);
          window.history.go(-1);
          setModal(null);
          refreshRoomList();
        },
      ],
      [
        t["📧 신고하기"][language],
        () => {
          const subject = encodeURIComponent(`[신고] ${roomData?.title}, id:${roomData?.thread_id}`);
          const body = encodeURIComponent("신고 내용:\n\n여기에 신고 내용을 입력해주세요.");
          const mailtoLink = `mailto:spacechat-io@proton.me?subject=${subject}&body=${body}`;
          window.open(mailtoLink);
          setModal(null);
        },
      ],
      [
        t["📤 커뮤니티로 내보내기"][language],
        () => {
          if (!roomData) return;

          if (roomData.last_index < 5)
            return alert(t["커뮤니티로 내보내기 위해서는 최소 5개의 쪽지가 존재해야합니다."][language]);

          const randomWord = wordList[language][Math.floor(Math.random() * wordList[language].length)];
          const title = `${nickname}${t["님의"][language]} ${randomWord} ${t["이야기"][language]} `;
          submitRef.current.title = title;
          submitRef.current.main_index = 1;
          submitRef.current.tag = "";
          setModal(
            DefaultModalTemplete(
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
                <div className="message-title">{t["제목"][language]}</div>
                <input
                  defaultValue={title}
                  placeholder={t["쪽지의 제목을 입력해주세요."][language]}
                  css={TextareaDefaultStyle}
                  style={{ width: "calc(100% - 22px)", height: "1rem", fontSize: "0.8rem" }}
                  onChange={({ target: { value } }) => (submitRef.current.title = value)}
                />
                <div className="message-title">{t["메인 쪽지 번호"][language]}</div>
                <input
                  defaultValue={"#1"}
                  placeholder={t["중심이 되는 쪽지 번호를 입력해주세요."][language]}
                  css={TextareaDefaultStyle}
                  style={{ width: "calc(100% - 22px)", height: "1rem", fontSize: "0.8rem" }}
                  onChange={({ target: { value } }) =>
                    (submitRef.current.main_index = Number(value.replaceAll(/\D/g, "")))
                  }
                />
                <div className="message-title">{t["태그"][language]}</div>
                <input
                  placeholder={t["태그를 1개 선택해주세요. (콤마로 구분, 최대 3개)"][language]}
                  css={TextareaDefaultStyle}
                  style={{ width: "calc(100% - 22px)", height: "1rem", fontSize: "0.8rem" }}
                  onChange={({ target: { value } }) => (submitRef.current.tag = value)}
                />
                <button
                  className="button-dark"
                  style={{ marginTop: 24 }}
                  onClick={async () => {
                    if (!submitRef.current.title) return alert(t["쪽지의 제목을 입력해주세요"][language]);
                    if (!submitRef.current.main_index) return alert(t["메인 쪽지 번호를 입력해주세요"][language]);
                    if (!submitRef.current.tag) return alert(t["태그를 최소 1개 입력해주세요"][language]);

                    setModal(null);
                    const tagList = submitRef.current.tag.split(",").map((t) => t.trim());
                    if (tagList.length > 3) return alert(t["태그는 최대 3개까지만 선택할 수 있습니다."][language]);
                    await axios
                      .post("/api/thread-public-create", {
                        thread_id: roomData.thread_id,
                        tag: tagList,
                        title: submitRef.current.title,
                        profile_emoji: profile_emoji,
                        last_index: roomData.last_index,
                        main_index: submitRef.current.main_index,
                      })
                      .catch((d) => {
                        if (d.response.data.error === "no content: need check thread_id and index")
                          alert(t["없는 쪽지 번호입니다."][language]);
                      });
                  }}
                >
                  {t["완료"][language]}
                </button>
              </div>
            )
          );
        },
      ],
    ];
    const moreModal = SelectModalTemplete(modalBtnList);
    return (
      <button
        className="header-right"
        style={{
          opacity: 1,
          visibility: "visible",
          minWidth: 46,
          marginRight: 10,
        }}
        onClick={() => setModal(moreModal)}
      >
        <div style={{ padding: "5px 0" }}>
          <Image width={3} height={11} src="/icon/more.svg" alt="more" />
        </div>
        <Ripple />
      </button>
    );
  }
  if (type === "user") {
    const modalBtnList: [title: string, onClick: () => void][] = [
      [
        t["📧 신고하기"][language],
        () => {
          const subject = encodeURIComponent(
            `[신고] ${userData?.profile_emoji} ${userData?.nickname}, user_id:${userData?.user_id}`
          );
          const body = encodeURIComponent("신고 내용:\n\n여기에 신고 내용을 입력해주세요.");
          const mailtoLink = `mailto:spacechat-io@proton.me?subject=${subject}&body=${body}`;
          window.open(mailtoLink);
          setModal(null);
        },
      ],
    ];
    const moreModal = SelectModalTemplete(modalBtnList);
    return (
      <button
        className="header-right"
        style={{
          opacity: 1,
          visibility: "visible",
          minWidth: 46,
          marginRight: 10,
        }}
        onClick={() => setModal(moreModal)}
      >
        <div style={{ padding: "5px 0" }}>
          <Image width={3} height={11} src="/icon/more.svg" alt="more" />
        </div>
        <Ripple />
      </button>
    );
  }
  if (type === "community-message-detail") {
    const onBookmark = async () => {
      if (!communityRoomData?.thread_id) return;
      setIsBookmark((p) => !p, false);
      await axios.post(`/api/thread-public-${isBookmark ? "delete" : "add"}-bookmark`, {
        thread_id: communityRoomData?.thread_id,
      });
    };
    const modalBtnList: [title: string, onClick: () => void][] = [
      [
        t["🧾 전체 쪽지 내용 복사하기"][language],
        () => {
          const formattedData = messageList
            ? messageList
                .map((message) => {
                  const { index, profile_emoji, nickname, created_at, content } = message;
                  return `[${index}] ${profile_emoji} ${nickname || ""} ${created_at}\n${content}`;
                })
                .join("\n")
            : "";
          clipboardCopyV2(formattedData, () => alert(t["쪽지 내용 복사가 완료되었습니다"][language]), false);
          setModal(null);
        },
      ],
      [
        t["💾 전체 쪽지 내용 다운로드"][language],
        () => {
          if (!communityRoomData) return;

          const formattedData = messageList
            ? messageList
                .map((message) => {
                  const { index, profile_emoji, nickname, created_at, content } = message;
                  return `[${index}] ${profile_emoji} ${nickname || ""} ${created_at}\n${content}`;
                })
                .join("\n")
            : "";
          function downloadToTxt(formattedData: string, filename: string) {
            const blob = new Blob([formattedData], { type: "text/plain" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = `${filename}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }
          function removeEmojisAndSpaces(text: string) {
            const regex = emojiRegex();
            let result = text.trim().replace(regex, "").replace(/\s+/g, "_");
            return result;
          }

          if (isApp) window.Android.saveToFile(formattedData, removeEmojisAndSpaces(communityRoomData.title));
          else {
            downloadToTxt(formattedData, removeEmojisAndSpaces(communityRoomData.title));
            alert(t["쪽지 내용 다운로드가 완료되었습니다"][language]);
          }

          setModal(null);
        },
      ],
      [
        t["🔗 링크 공유하기"][language],
        () => {
          if (!communityRoomData || !communityRoomData.thread_id) return;
          const link = `https://space-chat.io/archive?id=${communityRoomData.thread_id * 183}`;
          if (isApp) window.Android.shareText(link);
          else clipboardCopyV2(link, () => alert(t["링크 복사가 완료되었습니다"][language]));
          setModal(null);
        },
      ],
    ];
    if (communityRoomData?.created_user_id === user_id) {
      modalBtnList.unshift([
        t["💣 커뮤니티에서 삭제하기"][language],
        async () => {
          if (!communityRoomData) return;
          const check = confirm(t["정말로 커뮤니티에서 삭제하시겠습니까?"][language]);
          if (!check) return;

          await axios.delete(`/api/thread-public-delete?thread_id=${communityRoomData.thread_id}`);
          window.history.go(-1);
          setModal(null);
        },
      ]);
      modalBtnList.splice(3, 0, [
        t["🔧 수정하기"][language],
        () => {
          if (!communityRoomData) return;

          const title = communityRoomData.title;
          const main_index = communityRoomData.main_index;
          const tag = communityRoomData.tag.join(", ");
          submitRef.current.title = title;
          submitRef.current.main_index = main_index;
          submitRef.current.tag = tag;
          setModal(
            DefaultModalTemplete(
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
                <div className="message-title">{t["제목"][language]}</div>
                <input
                  defaultValue={title}
                  placeholder={t["쪽지의 제목을 입력해주세요."][language]}
                  css={TextareaDefaultStyle}
                  style={{ width: "calc(100% - 22px)", height: "1rem", fontSize: "0.8rem" }}
                  onChange={({ target: { value } }) => (submitRef.current.title = value)}
                />
                <div className="message-title">{t["메인 쪽지 번호"][language]}</div>
                <input
                  defaultValue={"#" + main_index}
                  placeholder={t["메인 쪽지 번호"][language]}
                  // placeholder={t["(선택) 기존 그대로 유지"][language]}
                  css={TextareaDefaultStyle}
                  style={{ width: "calc(100% - 22px)", height: "1rem", fontSize: "0.8rem" }}
                  onChange={({ target: { value } }) =>
                    (submitRef.current.main_index = Number(value.replaceAll(/\D/g, "")))
                  }
                />
                <div className="message-title">{t["태그"][language]}</div>
                <input
                  defaultValue={tag}
                  placeholder={t["태그를 1개 선택해주세요. (콤마로 구분, 최대 3개)"][language]}
                  css={TextareaDefaultStyle}
                  style={{ width: "calc(100% - 22px)", height: "1rem", fontSize: "0.8rem" }}
                  onChange={({ target: { value } }) => (submitRef.current.tag = value)}
                />
                <button
                  className="button-dark"
                  style={{ marginTop: 24 }}
                  onClick={async () => {
                    if (!submitRef.current.title) return alert(t["쪽지의 제목을 입력해주세요"][language]);
                    if (!submitRef.current.tag) return alert(t["태그를 최소 1개 입력해주세요"][language]);

                    setModal(null);
                    const tagList = submitRef.current.tag.split(",").map((t) => t.trim());
                    if (tagList.length > 3) return alert(t["태그는 최대 3개까지만 선택할 수 있습니다."][language]);

                    setCenterText({ emoji: profile_emoji || "", text: submitRef.current.title });
                    setCommunityRoomData((p) =>
                      !p
                        ? p
                        : {
                            ...p,
                            title: submitRef.current.title,
                            profile_emoji: profile_emoji || "",
                            last_index: communityRoomData.last_index,
                            main_index: submitRef.current.main_index,
                            tag: tag.split(",").map((i) => i.trim()),
                          }
                    );
                    await axios
                      .patch("/api/thread-public-update", {
                        thread_id: communityRoomData.thread_id,
                        tag: tagList,
                        title: submitRef.current.title,
                        profile_emoji: profile_emoji,
                        last_index: communityRoomData.last_index,
                        main_index: submitRef.current.main_index,
                      })
                      .catch((d) => {
                        if (d.response.data.error === "no content: need check thread_id and index")
                          alert(t["없는 쪽지 번호입니다."][language]);
                      });
                  }}
                >
                  {t["완료"][language]}
                </button>
              </div>
            )
          );
        },
      ]);
      modalBtnList.splice(3, 0, [
        t["↺ 쪽지 리스트 갱신하기"][language],
        async () => {
          if (!communityRoomData) return;
          const check = confirm(t["마지막 쪽지 공유 이후 추가된 쪽지들이 갱신됩니다."][language]);
          if (!check) return;

          const lastIndex = await axios
            .patch(`/api/thread-public-update-last-index`, {
              thread_id: communityRoomData.thread_id,
            })
            .then((d) => d.data.result);
          const room = { ...communityRoomData, last_index: lastIndex };
          router.replace(`/community/message?id=${encrypt(JSON.stringify(room)) + ""}`);
          setModal(null);
        },
      ]);
    } else {
      modalBtnList.unshift([
        t["📧 신고하기"][language],
        () => {
          const subject = encodeURIComponent(`[신고] ${communityRoomData?.title}, id:${communityRoomData?.thread_id}`);
          const body = encodeURIComponent("신고 내용:\n\n여기에 신고 내용을 입력해주세요.");
          const mailtoLink = `mailto:spacechat-io@proton.me?subject=${subject}&body=${body}`;
          window.open(mailtoLink);
          setModal(null);
        },
      ]);
    }
    const moreModal = SelectModalTemplete(modalBtnList);
    return (
      <>
        <button
          className="header-right"
          style={{
            opacity: 1,
            visibility: "visible",
            minWidth: 46,
            marginLeft: 0,
          }}
          onClick={onBookmark}
        >
          <div style={{ padding: "5px 0" }}>
            <Image width={20} height={20} src={`/icon/ic_star_${isBookmark ? "on" : "off"}.svg`} alt="bookmark" />
          </div>
          <Ripple />
        </button>

        <button
          className="header-right"
          style={{
            opacity: 1,
            visibility: "visible",
            minWidth: 46,
            marginLeft: 0,
          }}
          onClick={() => setModal(moreModal)}
        >
          <div style={{ padding: "5px 0" }}>
            <Image width={3} height={11} src="/icon/more.svg" alt="more" />
          </div>
          <Ripple />
        </button>
      </>
    );
  }
  if (type === "search")
    return (
      <button
        className="header-right"
        style={{
          opacity: 1,
          visibility: "visible",
          minWidth: 46,
          marginRight: 10,
        }}
        onClick={() => router.push("/search?page=1&size=10&sort=update&created=all&d=title&query=")}
      >
        <div style={{ padding: "5px 0" }}>검색</div>
        <Ripple />
      </button>
    );
  if (type === "search-icon")
    return (
      <button
        className="header-right"
        style={{
          opacity: 1,
          visibility: "visible",
          minWidth: 46,
          marginRight: 10,
          background: "#26263b",
        }}
        onClick={() => {
          const goToTop = () => document.getElementById("community-search")?.scrollTo({ top: 0, behavior: "auto" });

          const select = document.getElementById("search-select") as HTMLSelectElement;
          const input = document.getElementById("search-input") as HTMLInputElement;

          if (!select || !input) return;

          // ios 키code 입력 필요.
          const obj = urlParamsToObj(router.asPath);
          const d = select.value as dType;

          if (!input.value && obj.query != undefined) {
            router.push("/search?page=1&size=10&sort=update&created=all&d=title&query=");
            goToTop();
            return;
          }

          if (obj.d === d && obj.value === input.value) return;

          obj.d = d;
          obj.query = input.value;
          obj.page = "1";
          router.push(`/search?${objToURLParams(obj)}`);
          goToTop();
        }}
      >
        <div style={{ padding: "7px 0 5px 0" }}>
          <Image width={19.52} height={20} src="/icon/search_button.svg" alt="search" />
        </div>
        <Ripple />
      </button>
    );

  return null;
};
