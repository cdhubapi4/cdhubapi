import { css, keyframes } from "@emotion/react";
import { atom, useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import Ripple from "./Ripple";

export const SnackbarState = atom<string | null>({
  key: "SnackbarState",
  default: null,
});

export const Snackbar = () => {
  const [snackbar, setSnackbar] = useRecoilState(SnackbarState);
  const [isVisible, setIsVisible] = useState(!!snackbar);

  useEffect(() => {
    if (snackbar) {
      setIsVisible(true);
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [snackbar]);

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => {
        setSnackbar(null);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, setSnackbar]);

  if (!snackbar) return null;

  return (
    <button
      css={[Style, !isVisible && fadeOutStyle]}
      onClick={() => {
        setIsVisible(false);
      }}
    >
      {snackbar}
      <Ripple />
    </button>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const Style = css`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 4px 10px 5px 10px;
  border-radius: 20px;
  background: #363a3d;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-family: Noto Sans;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 300;
  line-height: 1.2rem;
  letter-spacing: -0.5px;
  animation: ${fadeIn} 0.5s forwards;

  &:hover {
    background: #2d3133;
  }
`;

const fadeOutStyle = css`
  animation: ${fadeOut} 0.5s forwards;
`;
