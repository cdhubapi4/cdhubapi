import { memo } from "react";

const Page = ({ isFocus, children }: { isFocus: boolean; children: JSX.Element | JSX.Element[]; isDev?: boolean }) => {
  return (
    <div
      style={{
        visibility: isFocus ? "visible" : "hidden",
        zIndex: isFocus ? 1 : 0,
        opacity: isFocus ? 1 : 0,
        position: "fixed",
        width: "100vw",
        maxWidth: 600,
        display: "flex",
        flexDirection: "column",
        background: "#18171C",
        minHeight: "calc(var(--vh) - 130px)",
      }}
    >
      {children}
    </div>
  );
};

export default memo(Page, (p, n) => p.isFocus === n.isFocus && n.isDev === false);
