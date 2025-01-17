import { forwardRef } from "react";
import Ink from "react-ink";

/**
 * @description 버튼에 ripple 효과를 주기위해 사용합니다.
 * @example  <button css={Style(disabled)}>
      버튼내용
      <Ripple/>
    </button>
 */
export default function Ripple() {
  return <Ink style={{ color: "rgba(255,255,255,0.8)" }} />;
}

/** @description ripple 이 달린 a 태그입니다. */
export const RippledATag = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { children?: React.ReactNode }
>(({ children, ...props }, ref) => {
  return (
    <a ref={ref} style={{ display: "flex", position: "relative", ...props.style }} {...props}>
      {children}
      <Ripple />
    </a>
  );
});
