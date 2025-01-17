import { useState, useEffect } from "react";

/**
 * 현재 브라우저 윈도우의 width, height를 가져오는 hook
 * @return {{width: undefined | number, height: undefined | number }}
 */
export default function useWindowSize() {
  // SSR/CSR 매치를 위해 width/height 초기값을 undefined로 설정
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{ width: undefined | number; height: undefined | number }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    // 초기 윈도우 사이즈를 얻기 위해 바로 함수를 실행
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
