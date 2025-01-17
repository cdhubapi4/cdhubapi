import { Loader } from "@/components/layout/Loader";
import { UserDataType } from "@/components/util/getUserData";
import { t } from "@/components/util/translate";
import { css } from "@emotion/react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Ripple from "../../layout/Ripple";
import { useSetRecoilState } from "recoil";
import { SnackbarState } from "@/components/layout/Snackbar";

export const WriteContent = ({ userData }: { userData: UserDataType }) => {
  const router = useRouter();
  const setSnackbar = useSetRecoilState(SnackbarState);

  const language = userData.settings.language;
  const [isLoading, setIsLoading] = useState(false);

  const text = useRef("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  const onClickSend = async () => {
    const content = text.current;
    if (!content) return;
    setIsLoading(true);
    router.push("/");

    text.current = "";
    if (textareaRef.current) textareaRef.current.value = "";
    await axios.post(`/api/thread-letter-create`, { content }).catch(() => {
      text.current = content;
      if (textareaRef.current) textareaRef.current.value = content;
    });

    setIsLoading(false);
    setSnackbar(t["5개의 쪽지를 보냈습니다"][language]);
  };

  return (
    <>
      <div style={{ margin: "10px 10px 0px", display: "flex" }}>
        <textarea
          css={TextareaStyle}
          onChange={(e) => (text.current = e.target.value)}
          ref={textareaRef}
          placeholder={t["쪽지내용을 입력해주세요"][language]}
        />
      </div>
      <button
        css={ButtonStyle}
        className="button-default button-text"
        onClick={onClickSend}
        disabled={isLoading}
        ref={sendButtonRef}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Image width={20} height={20} src="/icon/send_message_w18.png" alt="" />
            <div style={{ marginLeft: 8 }}>{t["쪽지 보내기"][language]}</div>
            <Ripple />
          </>
        )}
      </button>
    </>
  );
};
const ButtonStyle = css`
  width: calc(100vw - 20px);
  max-width: calc(600px - 20px);

  height: 50px;

  /* border-radius: 4px;
  border: 1px solid #5b6783;
  background: #363d4e; */

  margin: 10px 10px 0 10px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
export const TextareaDefaultStyle = css`
  border-radius: 2px;
  border: 1px solid #2a2c38;
  background: #21212d;

  margin: 10px 10px 0px;
  display: flex;
  width: 100%;
  @media screen and (max-height: 1800px) {
    height: max(calc(var(--vh) - 640px), 200px);
  }
  @media screen and (max-height: 430px) {
    height: calc(var(--vh) - 230px);
  }
  outline: none;

  padding: 10px;
  word-break: break-all;
  margin: 0;
  resize: none;

  color: #ddd;
  font-family:
    Spoqa Han Sans Neo,
    -apple-system,
    BlinkMacSystemFont,
    "Malgun Gothic",
    "맑은 고딕",
    helvetica,
    "Apple SD Gothic Neo",
    sans-serif;
  font-size: 0.9230769230769231rem; /* 12px */
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;
const TextareaStyle = css`
  border-radius: 2px;
  border: 1px solid #2a2c38;
  background: #21212d;

  margin: 10px 10px 0px;
  display: flex;
  width: 100%;
  height: 8rem;
  outline: none;

  padding: 10px;
  word-break: break-all;
  margin: 0;
  resize: none;

  color: #ddd;
  font-family:
    Spoqa Han Sans Neo,
    -apple-system,
    BlinkMacSystemFont,
    "Malgun Gothic",
    "맑은 고딕",
    helvetica,
    "Apple SD Gothic Neo",
    sans-serif;
  font-size: 0.9230769230769231rem; /* 12px */
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;
