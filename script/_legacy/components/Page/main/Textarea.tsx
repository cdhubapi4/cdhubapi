import { css } from "@emotion/react";
import { useRef } from "react";
import Ripple from "../../layout/Ripple";

const InputStyle = css`
  margin: 40px 0 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 120px;
`;
const TextareaStyle = css`
  border-radius: 2px;
  border: 1px solid #2a2c38;
  background: #21212d;
  width: calc(100% - 20px - 24px);
  height: 200px;
  outline: none;

  padding: 12px 10px;
  word-break: break-all;
  margin: 0 12px;
  resize: none;

  /* color: #ddd;
  font-family: Spoqa Han Sans Neo, -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", helvetica, "Apple SD Gothic Neo", sans-serif;
  font-size: 0.9230769230769231rem; //12px
  font-style: normal;
  font-weight: 300;
    line-height: normal;  */

  color: #d2d2d5;
`;

/* 키보드 설정 및 확인 눌렀을때 반응추가 필요 onSubmit */
export const Textarea = ({
  onSubmit,
  disabled = false,
  placeholder,
}: {
  onSubmit?: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div css={InputStyle}>
      <textarea
        ref={inputRef}
        css={TextareaStyle}
        className="message-content"
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        id="send-btn"
        onClick={() => {
          if (!onSubmit || !inputRef.current) return;
          onSubmit(inputRef.current.value);
          inputRef.current.value = "";
        }}
        style={{ opacity: disabled ? 0.3 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
        disabled={disabled}
      >
        답장
        {!disabled && <Ripple />}
      </button>
    </div>
  );
};
