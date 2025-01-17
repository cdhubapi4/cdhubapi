import { css } from "@emotion/react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useRef } from "react";
import Ripple from "../../layout/Ripple";

const InputStyle = css`
  margin: 10px 0 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;

  div {
    height: 0;
  }
`;
export const TextareaStyle = css`
  border-radius: 2px;
  border: 1px solid #2a2c38;
  background: #21212d;

  width: calc(100% - 34px);
  height: min(3.9rem, 101px);
  outline: none;
  position: relative;
  left: 10px;

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
`;

/* 키보드 설정 및 확인 눌렀을때 반응추가 필요 onSubmit */
export const CommunityTextarea = ({ onSubmit }: { onSubmit?: (value: string) => void }) => {
  const text = useRef("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div css={InputStyle}>
      <TextareaAutosize
        ref={inputRef}
        css={TextareaStyle}
        minRows={3}
        onChange={({ target: { value } }) => (text.current = value)}
      />
      <div>
        <button
          id="send-btn"
          onClick={() => {
            if (onSubmit) onSubmit(text.current);
            if (inputRef.current) inputRef.current.value = "";
            text.current = "";
          }}
        >
          댓글 쓰기
          <Ripple />
        </button>
      </div>
    </div>
  );
};
