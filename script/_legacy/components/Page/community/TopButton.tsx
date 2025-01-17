import { useState, useEffect, CSSProperties } from "react";
import { SerializedStyles, css } from "@emotion/react";

export const TopButton = ({
  elementId = "community-search",
  bottom = 20,
  style,
}: {
  elementId?: string;
  bottom?: number;
  style?: CSSProperties;
}) => {
  const [rotateAngle, setRotateAngle] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById(elementId);
      if (element) {
        const scrollTop = element.scrollTop;
        if (scrollTop <= 100) setRotateAngle(180); // 100 스크롤에 대해 180도 회전
        else setRotateAngle(0);
      }
    };
    const element = document.getElementById(elementId);
    element?.addEventListener("scroll", handleScroll);
    return () => {
      element?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div css={TopStyle(rotateAngle, bottom)} style={style}>
      <button
        onClick={() => {
          if (rotateAngle === 0) document.getElementById(elementId)?.scrollTo({ top: 0, behavior: "smooth" });
          else document.getElementById(elementId)?.scrollTo({ top: 10000000000000, behavior: "smooth" });
        }}
      >
        <img src="/icon/ic_top.svg" width="42" height="42" alt="top" />
      </button>
    </div>
  );
};

const TopStyle = (rotateAngle: number, bottom: number) => css`
  position: fixed;
  bottom: ${bottom}px;
  z-index: 1;
  button {
    transform: rotate(${rotateAngle}deg);
    transition: transform 0.3s; // 부드러운 회전을 위한 transition
    transform-origin: 50% 40%;
    background: none;
    display: flex;
    position: relative;
    left: calc(min(100vw, 600px) - 54px - 20px);
    z-index: 1000;
  }
`;
