import { RefObject, useEffect } from "react";

const useScrollPosition = (scrollContainerRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    // 스크롤 위치 저장 함수
    const saveScrollPosition = () => {
      if (scrollContainer) {
        sessionStorage.setItem("scrollPosition", scrollContainer.scrollTop.toString());
      }
    };

    // 페이지 로드 시 이전 스크롤 위치로 이동
    const savedScrollPosition = sessionStorage.getItem("scrollPosition");
    if (savedScrollPosition && scrollContainer) {
      scrollContainer.scrollTop = parseInt(savedScrollPosition, 10);
    }

    // 스크롤 이벤트 리스너 등록
    scrollContainer?.addEventListener("scroll", saveScrollPosition);

    // 클린업 함수
    return () => {
      scrollContainer?.removeEventListener("scroll", saveScrollPosition);
    };
  }, [scrollContainerRef]);
};

export default useScrollPosition;
