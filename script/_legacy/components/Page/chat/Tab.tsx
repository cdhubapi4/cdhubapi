import { css } from "@emotion/react";
import { Children, MouseEvent, ReactNode, TouchEventHandler, useEffect, useRef, useState } from "react";

interface TabProps {
  children: ReactNode;
  tabIndex: number;
  setTabIndex?: (index: number) => void;
}

/**
 *
 * @example    const [tabIndex, setTabIndex] = useState(0);
 * return <>
 * <TabHeader tabIndex={tabIndex} setTabIndex={setTabIndex} />
 * 	 <Tab tabIndex={tabIndex} setTabIndex={setTabIndex}>
 * 		<div>a</div>
 * 		<div>b</div>
 * 	</Tab>
 * <>;
 * @returns
 */
export default function Tab({ children, tabIndex, setTabIndex }: TabProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // tabIndex가 변경될 때 스크롤 위치 업데이트
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const newScrollLeft = tabIndex * containerWidth;
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  }, [tabIndex]);

  const onDragStart = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.clientX);
    setScrollStart(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
    scrollContainerRef.current.style.userSelect = "none";
  };

  const onDragMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current || !isDragging) return;
    e.preventDefault();
    const currentX = e.clientX;
    const deltaX = currentX - startX;
    scrollContainerRef.current.scrollLeft = scrollStart - deltaX;
  };

  const onDragEnd = () => {
    if (!scrollContainerRef.current) return;

    setIsDragging(false);
    const endX = scrollContainerRef.current.scrollLeft;
    const deltaX = endX - scrollStart;
    const containerWidth = scrollContainerRef.current.offsetWidth;
    let snapPoint;
    if (Math.abs(deltaX) >= 30) {
      if (deltaX > 0) {
        snapPoint = Math.ceil(endX / containerWidth) * containerWidth;
      } else snapPoint = Math.floor(endX / containerWidth) * containerWidth;
    } else snapPoint = Math.round(endX / containerWidth) * containerWidth;
    scrollContainerRef.current.scrollTo({ left: snapPoint, behavior: "smooth" });
    scrollContainerRef.current.style.cursor = "grab";
    scrollContainerRef.current.style.removeProperty("user-select");
    if (setTabIndex) setTabIndex(snapPoint / containerWidth);
  };

  const onDragStartTouch: TouchEventHandler<HTMLDivElement> = (e) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    // 터치 이벤트에서는 첫 번째 터치 포인트의 clientX를 사용합니다.
    setStartX(e.touches[0].clientX);
    setScrollStart(scrollContainerRef.current.scrollLeft);
    // 스타일 설정은 동일하게 유지합니다.
  };

  const onDragMoveTouch: TouchEventHandler<HTMLDivElement> = (e) => {
    if (!scrollContainerRef.current || !isDragging) return;
    // e.preventDefault();
    // 터치 이벤트에서는 첫 번째 터치 포인트의 clientX를 사용합니다.
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    scrollContainerRef.current.scrollLeft = scrollStart - deltaX;
  };
  return (
    <div
      css={Style}
      ref={scrollContainerRef}
      className="scroll-container"
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onDragStart={(e) => e.preventDefault()}
      onTouchStart={onDragStartTouch}
      onTouchMove={onDragMoveTouch}
      onTouchEnd={onDragEnd}
      onTouchCancel={onDragEnd}
    >
      {Children.map(children, (child, index) => (
        <div key={index} className="scroll-item">
          {child}
        </div>
      ))}
    </div>
  );
}

const Style = css`
  ::-webkit-scrollbar {
    display: none; /* 스크롤 바 숨기기 */
  }

  display: flex;
  overflow-x: auto;

  .scroll-item {
    flex: 0 0 auto;
    width: 100%;
  }

  h1 {
    padding-top: 13px;
    padding-bottom: 13px;
    color: #fff;
    text-align: center;
    font-family: KCCPakKyongni;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .header-center {
    gap: 6px;
    width: calc(100% - 32px);
    /* margin: 0 16px; */
    background-color: #2a2a41;
    display: flex;
    align-items: center;
    padding: 11px 12px 9px 12px;

    color: #d2d2d5;
    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif;
    font-size: 0.6923076923076923rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.7692307692307693rem; /* 111.111% */
    letter-spacing: -0.18px;
  }
`;
