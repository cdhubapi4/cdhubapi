import { css } from "@emotion/react";

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

function getStyles(level: number): React.CSSProperties {
  const section = Math.floor(level / 20);
  const progressInSection = (level % 20) / 20;

  const colors: RGBColor[] = [
    { r: 24, g: 23, b: 28 }, // rgba(24, 23, 28, 1)
    { r: 0, g: 119, b: 176 }, // rgba(0, 119, 176, 1)
    { r: 0, g: 36, b: 125 }, // rgba(0, 36, 125, 1)
    { r: 2, g: 128, b: 2 }, // rgba(2, 128, 2, 1)
    { r: 101, g: 31, b: 255 }, // rgba(101, 31, 255, 1)
    { r: 74, g: 47, b: 39 }, // rgba(74, 47, 39, 1)
    { r: 219, g: 22, b: 27 }, // rgba(219, 22, 27, 1)
  ];

  const startColor = colors[section];
  const endColor = colors[section + 1] || colors[section]; // 마지막 구간의 경우 endColor를 black으로 설정

  const r = Math.round(lerp(startColor.r, endColor.r, progressInSection));
  const g = Math.round(lerp(startColor.g, endColor.g, progressInSection));
  const b = Math.round(lerp(startColor.b, endColor.b, progressInSection));

  const backgroundColor = `rgb(${r}, ${g}, ${b})`;

  return {
    background: backgroundColor,
    // border: "2px solid gray",
  };
}

interface LevelTextProps {
  level: number;
  isLogin: boolean;
}

export const LevelText: React.FC<LevelTextProps> = ({ level, isLogin }) => {
  //no login user
  if (!isLogin)
    return (
      <p css={Style} style={getStyles(0)}>
        -
      </p>
    );
  //deleted or out user
  if (level < 0)
    return (
      <p css={Style} style={getStyles(0)}>
        x
      </p>
    );
  //max level
  if (level >= 100)
    return (
      <p css={Style} style={getStyles(99)}>
        {level}
      </p>
    );
  //logined user
  return (
    <p css={Style} style={getStyles(level)}>
      {level}
    </p>
  );
};

const Style = css`
  color: #fff;
  text-align: center;
  font-family:
    Spoqa Han Sans Neo,
    -apple-system,
    BlinkMacSystemFont,
    "Malgun Gothic",
    "맑은 고딕",
    helvetica,
    "Apple SD Gothic Neo",
    sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 350;
  line-height: 14px;
  border-radius: 10px;
  padding: 4px 4px 1px;
  height: fit-content;
  min-width: 18px;
  width: fit-content;
`;
