import useWindowSize from "@/components/hook/useWindowSize";
import { useEffect, useState } from "react";

export default function Container({ children }: { children?: JSX.Element[] | JSX.Element }) {
  const { height } = useWindowSize();

  // ios, android 등 모바일 기기의 100vh 이슈 해결
  useEffect(() => {
    document.documentElement.style.setProperty("--vh", `${height}px`);
  }, [height]);

  const [isMount, setIsMount] = useState(false);
  useEffect(() => setIsMount(true), []);
  if (!isMount) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: "#18171C",
          width: "200vw",
          maxWidth: 600,
          minHeight: "var(--vh)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
