import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const barMargin: number = 10;
export const BottomSheet = ({
  onScrollStart,
  onScrollEnd,
  onChangeIndex,
  children,
  header,
  onRef,
  snapPoint = [60, window.innerHeight / 4, window.innerHeight / 2, window.innerHeight - 100],
  defaultSnapPoint = window.innerHeight - window.innerHeight / 4,
}: {
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
  onChangeIndex?: (index: number) => void;
  children?: JSX.Element | JSX.Element[];
  header?: JSX.Element | JSX.Element[];
  onRef?: (ref: HTMLDivElement | null) => void;
  snapPoint?: number[];
  defaultSnapPoint?: number;
}) => {
  const router = useRouter();
  const bottomSheetRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const prevSnapPointIndexRef = useRef<number>(0);
  const scrollTopAtStartDrag = useRef<number>(0);
  const isDrag = useRef<boolean>(false);

  useEffect(() => {
    bottomSheetRef.current = null;

    // 페이지 나갈때 초기화
    return () => scrollToBottomSheet(window.innerHeight - 60);
  }, [router]);

  const scrollToBottomSheet = (value: number) => {
    if (bottomSheetRef.current && contentRef.current) {
      const max = window.innerHeight - 10;
      const moveMouse = window.innerHeight - value + 15;
      const bottomSheetPositionY = Math.max(60, Math.min(max, moveMouse));
      bottomSheetRef.current.style.transform = `translateY(calc(100% - ${bottomSheetPositionY}px))`;
      const contentHeight = Math.max(60, Math.min(moveMouse, window.innerHeight - 10));
      if (contentHeight) contentRef.current.style.height = `calc(var(--vh) - 60px - var(--vh) + ${contentHeight}px)`;
    }
  };

  const event = (scrollTop: number) => (isDrag ? scrollToBottomSheet(scrollTop) : null);
  const endEvent = (endPositionY: number) => {
    if (isDrag) {
      if (onScrollEnd) onScrollEnd();
      // setIsDrag(false);
      onDragEnd();

      // # 마우스 뗄 때 가장 가까운 snapPoint 위치로 이동
      const diff = scrollTopAtStartDrag.current - endPositionY;
      const bottomScrollTop = window.innerHeight - endPositionY;
      let max = { height: snapPoint[0], gap: Math.abs(bottomScrollTop - snapPoint[0]), index: 0 };
      snapPoint.forEach((p, index) => {
        const gap = Math.abs(bottomScrollTop - p);
        if (max.gap > gap) max = { height: p, gap, index };
      });

      // # 마우스 뗄 때 가장 가까운 snapPoint 위치가 클릭 전과 동일할 때 level px 이상 이동했으면
      // # 위 또는 아래로 이동함.
      const level = 2;
      if (max.index === prevSnapPointIndexRef.current) {
        if (diff > level) {
          // # 1. 위로 이동
          const index = prevSnapPointIndexRef.current + 1;
          scrollToBottomSheet(window.innerHeight - snapPoint[index]);
          prevSnapPointIndexRef.current = index;
          if (onChangeIndex) onChangeIndex(index);
        } else if (diff < -level) {
          // # 2. 아래로 이동
          const index = Math.max(prevSnapPointIndexRef.current - 1, 0);
          scrollToBottomSheet(window.innerHeight - snapPoint[index]);
          prevSnapPointIndexRef.current = index;
          if (onChangeIndex) onChangeIndex(index);
        } else {
          // # 3. 무시함
          scrollToBottomSheet(window.innerHeight - max.height);
          prevSnapPointIndexRef.current = max.index;
          if (onChangeIndex) onChangeIndex(max.index);
        }
      } else {
        scrollToBottomSheet(window.innerHeight - max.height);
        prevSnapPointIndexRef.current = max.index;
        if (onChangeIndex) onChangeIndex(max.index);
      }
    }
  };

  const mouseMoveEvent = (ev: MouseEvent) => event(ev.pageY);
  const mouseEndEvent = (ev: MouseEvent) => endEvent(ev.screenY);
  const touchMoveEvent = (ev: TouchEvent) => event(ev.changedTouches[0].pageY);
  const touchEndEvent = (ev: TouchEvent) => endEvent(ev.changedTouches[0].pageY);

  const onDrag = () => {
    if (onScrollStart) onScrollStart();
    if (bottomSheetRef.current) bottomSheetRef.current.style.transition = "none";
    if (contentRef.current) contentRef.current.style.transition = "none";
    document.body.addEventListener("mousemove", mouseMoveEvent);
    document.body.addEventListener("mouseleave", mouseEndEvent);
    document.body.addEventListener("mouseup", mouseEndEvent);
    document.body.addEventListener("touchmove", touchMoveEvent);
    document.body.addEventListener("touchend", touchEndEvent);
  };

  const onDragEnd = () => {
    if (bottomSheetRef.current) bottomSheetRef.current.style.transition = "transform 0.2s ease-in";
    if (contentRef.current) contentRef.current.style.transition = "height 0.2s ease-in";
    document.body.removeEventListener("mousemove", mouseMoveEvent);
    document.body.removeEventListener("mouseleave", mouseEndEvent);
    document.body.removeEventListener("mouseup", mouseEndEvent);
    document.body.removeEventListener("touchmove", touchMoveEvent);
    document.body.removeEventListener("touchend", touchEndEvent);
  };

  return (
    <div
      id="bottom-sheet-container"
      css={SheetStyle}
      ref={(r) => {
        if (bottomSheetRef.current === null && r) {
          bottomSheetRef.current = r;
          r.style.transform = "translateY(calc(100% - 60px))";
          scrollToBottomSheet(defaultSnapPoint);
        }
      }}
    >
      <div
        id="header"
        onPointerDown={(e) => {
          scrollTopAtStartDrag.current = e.screenY;
          // setIsDrag(true);
          onDrag();
        }}
      >
        <div id="bar-continer">
          <div id="bar" />
        </div>
        {header}
      </div>
      <div
        id="bottom-sheet-content"
        ref={(r) => {
          if (contentRef.current === null) {
            contentRef.current = r;
            if (onRef) onRef(r);
          }
        }}
      >
        {children}
      </div>
    </div>
  );
};
const SheetStyle = css`
  transition: transform 0.2s ease-in;

  border-radius: 10px 10px 0 0;
  border-top: #272727 1px solid;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);
  position: fixed;
  bottom: -3px;
  background-color: #1c1c21;
  z-index: 10;
  width: 100%;
  max-width: 600px;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;

  #bottom-sheet-content {
    transition: height 0.2s ease-in;
    height: 58px;
    overflow-y: scroll;
  }
  #header {
    display: flex;
    flex-direction: column;

    cursor: grab;
    #bar-continer {
      display: flex;
      justify-content: center;
    }
    #bar {
      width: 40px;
      height: 5px;
      border-radius: 100px;
      background-color: #313131;
      margin: ${barMargin}px 0;
    }
  }
`;
