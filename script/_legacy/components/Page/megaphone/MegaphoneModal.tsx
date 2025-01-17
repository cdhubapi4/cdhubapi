import { UserDataType } from "@/components/util/getUserData";
import { t } from "@/components/util/translate";
import { MegaphoneTextState } from "@/pages";
import { css } from "@emotion/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useRecoilValue } from "recoil";
import Ripple from "../../layout/Ripple";

export const MegaphoneModal = ({ userData }: { userData: UserDataType }) => {
  const router = useRouter();
  const { language } = userData.settings;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const megaphoneData = useRecoilValue(MegaphoneTextState);

  const onClickMegaphoneResponse = async (isEvent: boolean) => {
    if (isEvent) return router.replace("/setting");

    if (!textareaRef.current) return;
    const content = textareaRef.current.value;
    if (!content || !megaphoneData) return;

    const result = await axios
      .get(
        `/api/megaphone-response_init?thread_megaphone_id=${megaphoneData.thread_megaphone_id}&user_id=${userData.user_id}&content=${content}&created_user_id=${megaphoneData.created_user_id}&title=${megaphoneData.title}`
      )
      .then((d) => d.data.result);

    if (result !== true) return alert(t["네트워크에 문제가 생겼습니다."][language]);

    textareaRef.current.value = "";

    router.back();
  };
  const isEvent = megaphoneData?.isEvent ? true : false;

  const disabled = megaphoneData?.created_user_id === userData.user_id ? true : false;
  return (
    <div css={Style} onClick={() => router.back()}>
      <div id="box" style={{ zIndex: 1 }} onClick={(e) => e.stopPropagation()}>
        <textarea
          css={TextareaStyle}
          disabled
          style={{ height: "calc(var(--vh) * 0.2)", whiteSpace: "pre" }}
          value={megaphoneData && megaphoneData.title ? megaphoneData.title : undefined}
        />
        {!isEvent && (
          <textarea
            css={TextareaStyle}
            ref={textareaRef}
            defaultValue={disabled ? t["내가 쓴 확성기에 답장할 수 없습니다."][language] : undefined}
            disabled={disabled}
            style={{ opacity: disabled ? 0.3 : 1 }}
          />
        )}
        <button
          css={ButtonStyle}
          onClick={() => onClickMegaphoneResponse(isEvent)}
          style={{ opacity: disabled ? 0.3 : 1 }}
          disabled={disabled}
          className="button-default button-text"
        >
          {isEvent ? t["⚙️ 설정 바로가기"][language] : t["📮 답장하기"][language]}
          {!disabled && <Ripple />}
        </button>
      </div>
    </div>
  );
};
const ButtonStyle = css`
  width: calc(100vw - 60px);
  max-width: calc(600px - 60px);

  height: 50px;

  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
const Style = css`
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

    background: #18171c;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);
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
