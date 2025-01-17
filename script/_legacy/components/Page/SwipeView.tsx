import React, { useState, useRef, useEffect } from "react";
import Ripple from "../layout/Ripple";

const SwipeView = ({
  children,
  autoPlay = true,
  isInfinity = true,
  fullWidth = true,
  isDot = true,
}: {
  children: JSX.Element[];
  autoPlay?: boolean;
  isInfinity?: boolean;
  fullWidth?: boolean;
  isDot?: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [userInteracted, setUserInteracted] = useState<boolean>(!autoPlay);
  const pointerRef = useRef<{ x: number; containerLeft: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  //#region 유저 터치전 자동 이동
  useEffect(() => {
    if (isNaN(currentIndex)) return setCurrentIndex(0);
    if (userInteracted) return; // 사용자가 상호작용한 경우 인터벌을 생성하지 않습니다.
    const intervalId = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex > children.length - 1) nextIndex = 0;
      setCurrentIndex(nextIndex);
      if (containerRef.current) {
        const containerWidth = containerRef.current.getBoundingClientRect().width / children.length;

        containerRef.current.style.transform = `translateX(-${nextIndex * containerWidth}px)`;
      }
    }, 3000);
    return () => clearInterval(intervalId);
  }, [currentIndex, userInteracted]);
  const handleInteraction = () => setUserInteracted(true);
  //#endregion

  //#region 터치 이벤트
  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const x =
      e.type === "touchstart"
        ? (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX
        : (e as React.MouseEvent<HTMLDivElement>).clientX;

    // 수정된 부분 시작
    const containerStyle = window.getComputedStyle(containerRef.current);
    const containerList = containerStyle.getPropertyValue("transform").split(",");
    const containerLeft = containerList.length > 4 ? parseInt(containerList[4].trim(), 10) : 0;
    // 수정된 부분 끝

    setIsDragging(true);
    pointerRef.current = { x, containerLeft };
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !pointerRef.current || !containerRef.current) return;
    const x =
      e.type === "touchmove"
        ? (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX
        : (e as React.MouseEvent<HTMLDivElement>).clientX;
    const delta = x - pointerRef.current.x;
    containerRef.current.style.transform = `translateX(${pointerRef.current.containerLeft + delta}px)`;
  };
  const handlePointerUp = () => {
    if (!pointerRef.current || !containerRef.current) return;

    const containerLeft = parseInt(
      containerRef.current.style.transform.replace("translateX(", "").replace("px)", ""),
      10
    );
    const containerWidth = containerRef.current.getBoundingClientRect().width / children.length;
    let targetIndex = Math.round((containerLeft * -1) / containerWidth);

    if (targetIndex === currentIndex) {
      // 최소 좌우 1칸 이동
      const ratio = (containerLeft * -1) / containerWidth;
      const decimalPart = ratio - Math.floor(ratio);
      // 최소 이동 계수
      if (decimalPart > 0.04 && decimalPart < 0.92)
        //소수점 가져와서 방향판단
        decimalPart > 0.5 ? targetIndex-- : targetIndex++;
    }
    if (isInfinity) {
      if (targetIndex < 0) targetIndex = children.length - 1;
      if (targetIndex > children.length - 1) targetIndex = 0;
    } else {
      if (targetIndex < 0) targetIndex = 0;
      if (targetIndex > children.length - 1) targetIndex = children.length - 1;
    }
    setCurrentIndex(targetIndex);
    const movement = Math.max(targetIndex * containerWidth - 10, -10);

    // fullWidth가 아닌 경우에 한하여 translateX의 최대 값을 계산하고 적용
    if (!fullWidth && containerRef.current) {
      const itemWidth = 500; // maxWidth 값을 참조
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const maxMovement = containerWidth - itemWidth;

      if (movement > maxMovement) {
        containerRef.current.style.transform = `translateX(${-maxMovement}px)`;
        setIsDragging(false);
        pointerRef.current = null;
        return;
      }
    }

    containerRef.current.style.transform = `translateX(${-movement}px)`;
    setIsDragging(false);
    pointerRef.current = null;
  };
  const handleButtonClick = (index: number) => {
    setCurrentIndex(index);
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width / 5;
      const movement = Math.max(index * containerWidth - 10, -10);
      containerRef.current.style.transform = `translateX(${-movement}px)`;
    }
  };
  //#endregion

  return (
    <div onPointerEnter={!userInteracted ? handleInteraction : undefined}>
      <div
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        style={{
          width: "100%",
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          ref={containerRef}
          style={{
            marginLeft: 12,
            gap: 24,
            height: "100%",
            display: "flex",
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
        >
          {children.map((c, i) => (
            <div key={c.key} style={fullWidth ? { width: "calc(100vw - 45px)", maxWidth: 500 } : undefined}>
              {c}
            </div>
          ))}
        </div>
      </div>
      {isDot && (
        <div style={{ display: "flex", justifyContent: "center", gap: "min(1.875vw, 6px)", marginTop: 8 }}>
          {children.map((c, i) => (
            <button key={i} onClick={() => handleButtonClick(i)} style={{ background: "none" }}>
              <div
                style={{
                  width: "min(3.75vw, 12px)",
                  height: "min(3.75vw, 12px)",
                  borderRadius: 6,
                  background: currentIndex === i ? "#BCBCBC" : "#636363",
                }}
              />
              <Ripple />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SwipeView;
