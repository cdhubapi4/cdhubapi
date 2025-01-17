import useWindowSize from "@/components/hook/useWindowSize";
import { Interpolation, Theme } from "@emotion/react";
import { MouseEventHandler, ReactNode, TouchEventHandler, WheelEventHandler, useEffect, useRef, useState } from "react";

type PFullPageScroll = {
  onPageChange?: (page: number) => void;
  onLoad?: (limit: number) => void;
  children: ReactNode[];
};

export const FullPageScroll: React.FC<PFullPageScroll> = ({ children, onLoad = () => {}, onPageChange = () => {} }) => {
  const outerDivRef = useRef<HTMLDivElement>(null);
  const currentPage = useRef<number>(0);
  const canScroll = useRef<boolean>(true);
  const isDragging = useRef<boolean>(false);
  const deltaY = useRef<number>(0);
  const startY = useRef<number>(0);
  const { height } = useWindowSize();

  //#region Scroll Methods
  const onMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging.current || !outerDivRef.current) return;

    const pageHeight = outerDivRef.current?.children.item(0)?.clientHeight; // 화면 세로 길이 100vh
    if (!pageHeight) return;

    const currentScrollPosition = outerDivRef.current.scrollTop;
    const diff = deltaY.current - e.clientY;

    outerDivRef.current.scrollTo({ top: currentScrollPosition + diff, left: 0, behavior: "auto" });
    deltaY.current = e.clientY;
    canScroll.current = false;

    setTimeout(() => (canScroll.current = true), 500);
    // refresh((v) => v + 1);
  };
  const onMouseUp: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging.current) return;

    const endY = e.clientY; // 마우스 놓은 지점의 Y 좌표
    if (endY < startY.current) scrollDown();
    else if (endY > startY.current) scrollUp();

    isDragging.current = false;
  };
  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    isDragging.current = true;
    startY.current = e.clientY;
    deltaY.current = e.clientY;
  };
  const wheelHandler: WheelEventHandler<HTMLDivElement> = (e) => {
    // e.preventDefault();
    if (!canScroll.current) return;
    const { deltaY } = e; // +is down -is up
    if (deltaY > 0 && outerDivRef.current) scrollDown();
    else if (deltaY < 0 && outerDivRef.current) scrollUp();
  };
  const onTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    const clientY = e.changedTouches.item(0)?.clientY || 0;
    if (!isDragging.current || !outerDivRef.current) return;

    const pageHeight = outerDivRef.current?.children.item(0)?.clientHeight; // 화면 세로 길이 100vh
    if (!pageHeight) return;

    const currentScrollPosition = outerDivRef.current.scrollTop;
    const diff = deltaY.current - clientY;
    outerDivRef.current.scrollTo({ top: currentScrollPosition + diff, left: 0, behavior: "auto" });
    deltaY.current = clientY;
    canScroll.current = false;

    setTimeout(() => (canScroll.current = true), 500);
    // refresh((v) => v + 1);
  };
  const onTouchDown: TouchEventHandler<HTMLDivElement> = (e) => {
    const clientY = e.changedTouches.item(0)?.clientY || 0;
    isDragging.current = true;
    startY.current = clientY;
    deltaY.current = clientY;
    // e.preventDefault();
  };
  const onTouchUp: TouchEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging.current) return;
    const clientY = e.changedTouches.item(0)?.clientY || 0;
    const endY = clientY;
    if (endY + 10 < startY.current) scrollDown();
    else if (endY - 10 > startY.current) scrollUp();

    isDragging.current = false;
  };

  const scrollDown = () => {
    const pageHeight = outerDivRef.current?.children.item(0)?.clientHeight;
    if (outerDivRef.current && pageHeight) {
      outerDivRef.current.scrollTo({ top: pageHeight * (currentPage.current + 1), left: 0, behavior: "smooth" });
      canScroll.current = false;
      setTimeout(() => (canScroll.current = true), 500);
      if (outerDivRef.current.childElementCount - 1 > currentPage.current) currentPage.current++;
    }
    onPageChange(currentPage.current);
    // refresh((v) => v + 1);
  };
  const scrollUp = () => {
    const pageHeight = outerDivRef.current?.children.item(0)?.clientHeight; // 화면 세로 길이 100vh
    if (outerDivRef.current && pageHeight) {
      outerDivRef.current.scrollTo({ top: pageHeight * (currentPage.current - 1), left: 0, behavior: "smooth" });
      canScroll.current = false;
      setTimeout(() => (canScroll.current = true), 500);
      if (currentPage.current > 0) currentPage.current--;
    }
    onPageChange(currentPage.current);
    // refresh((v) => v + 1);
  };
  //#endregion

  useEffect(() => {
    const outer = outerDivRef.current;
    if (!outer) return;
    onLoad(outerDivRef.current.childElementCount);
    // refresh((v) => v + 1);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!outerDivRef.current) return;
    const scrollTop = outerDivRef.current.scrollTop;
    if (scrollTop === 0) e.preventDefault();
  };

  return (
    <div
      ref={outerDivRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp} // 마우스가 요소를 떠났을 때도 onMouseUp과 같은 처리를 함
      onWheel={wheelHandler}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchDown}
      onTouchEnd={onTouchUp}
      style={{ height: height || 0, width: "100%", overflowY: "hidden", background: "black" }}
      onScroll={handleScroll}
    >
      {children.map((i) => i)}
    </div>
  );
};
