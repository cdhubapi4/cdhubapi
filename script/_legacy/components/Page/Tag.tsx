import { css } from "@emotion/react";
import Ripple from "../layout/Ripple";
import { useRouter } from "next/router";
import { toShortNum } from "../util/toShortNum";

export const Tag = ({ name, count }: { name: string; count?: number }) => {
  const router = useRouter();
  return (
    <button
      css={Style}
      onClick={() => router.push(`/search?page=1&size=10&sort=update&created=all&d=tag&query=${name}`)}
    >
      #{name}
      {count ? ` (${toShortNum(count)})` : ""}
      <Ripple />
    </button>
  );
};

const Style = css`
  border-radius: 15px;
  border: 1px solid #313154;
  background: #21212d;

  padding: 3px 6px 5px 6px;

  color: #cecece;
  font-family:
    Spoqa Han Sans Neo,
    -apple-system,
    BlinkMacSystemFont,
    "Malgun Gothic",
    "맑은 고딕",
    helvetica,
    "Apple SD Gothic Neo",
    sans-serif;
  font-size: 0.6153846153846154rem; /* 8px */
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.4px;

  width: fit-content;

  display: flex;
  flex-direction: column;
  white-space: pre;
`;
