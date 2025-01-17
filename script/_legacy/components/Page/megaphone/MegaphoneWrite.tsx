import { UserDataType } from "@/components/util/getUserData";
import { t } from "@/components/util/translate";
import { MegaphoneTextState } from "@/pages";
import { MegaphoneResponseType } from "@/pages/api/megaphone-read-now";
import { css } from "@emotion/react";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";
import Ripple from "../../layout/Ripple";
import { MegaphoneListFetcher } from "./MegaphoneList";

export const MegaphoneWrite = ({ userData, isModal }: { userData: UserDataType; isModal: boolean }) => {
  const router = useRouter();
  const {
    settings: { language },
  } = userData;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: setMegaphoneList } = useSWR(`/api/megaphone-read-my-history`, MegaphoneListFetcher);
  const setMegaphoneData = useSetRecoilState(MegaphoneTextState);

  const onClickMegaphoneWrite = async () => {
    if (!textareaRef.current) return;
    const content = textareaRef.current.value;
    if (!content) return;

    const result = await axios.post(`/api/megaphone-create`, { content }).then((d) => d.data.result);

    if (result != true && result.expired_at)
      return alert(
        t["선착순 1명이 끝났습니다. "][language] +
          dayjs(result.expired_at).format("h시 m분") +
          t["에 다시 확성기 사용하기를 눌러주세요."][language]
      );

    textareaRef.current.value = "";
    setMegaphoneList();

    const getMegaphoneData = async () => {
      const data = await axios
        .get<{ result: MegaphoneResponseType }>(`/api/megaphone-read-now?language=${"KR"}`)
        .then((d) => d.data.result);
      setMegaphoneData(data);
    };
    getMegaphoneData();

    router.back();
  };
  return (
    <div css={Style(isModal)} onClick={() => router.back()}>
      <div id="box" style={{ zIndex: 1 }} onClick={(e) => e.stopPropagation()}>
        <textarea
          css={TextareaStyle}
          ref={textareaRef}
          placeholder={
            t[
              "\n\n이 곳에 확성기로 보낼 내용을 입력해주세요.\n\n- 불법/욕설/비방은 언제든지 삭제될 수 있습니다.\n- 이벤트 확성기는 24시간 동안만 유지됩니다."
            ][language]
          }
        />
        <button css={ButtonStyle} className="button-default button-text" onClick={onClickMegaphoneWrite}>
          {t["🔥 확성기 사용하기"][language]}
          <Ripple />
        </button>
      </div>
    </div>
  );
};
const ButtonStyle = css`
  width: calc(100vw - 60px);
  max-width: calc(600px - 60px);

  height: 50px;
  margin: 0;
  margin-top: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  color: #d2d2d5;
`;
const Style = (isModal: boolean) => css`
  visibility: ${isModal ? "visible" : "hidden"};
  opacity: ${isModal ? 1 : 0};
  transition:
    opacity 0.2s,
    visibility 0.2s;

  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  max-width: 600px;
  height: var(--vh);

  position: fixed;
  top: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  #box {
    position: relative;
    display: flex;
    flex-direction: column;
    top: calc(var(--vh) * -0.1);

    border-radius: 4px;
    background: #18171c;
    box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.25);

    border-radius: 4px;
  }
`;
const TextareaStyle = css`
  background-color: #21212d;
  border: none;
  border-radius: 2px;
  width: calc(100vw - 100px);
  max-width: calc(600px - 100px);

  height: calc(var(--vh) * 0.3);
  outline: none;

  padding: 10px;
  word-break: break-all;
  margin: 0;
  resize: none;

  font-family:
    Spoqa Han Sans Neo,
    -apple-system,
    BlinkMacSystemFont,
    "Malgun Gothic",
    "맑은 고딕",
    helvetica,
    "Apple SD Gothic Neo",
    sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 0.9230769230769231rem;
  line-height: normal;

  color: #d2d2d5;

  margin: 10px;
`;
