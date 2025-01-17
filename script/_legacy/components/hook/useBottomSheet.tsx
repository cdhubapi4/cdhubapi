import { useRef, useEffect } from "react";

interface BottomSheetMetrics {
  touchStart: {
    sheetY: number; // touchstart에서 BottomSheet의 최상단 모서리의 Y값
    touchY: number; // touchstart에서 터치 포인트의 Y값
  };
  touchMove: {
    prevTouchY?: number; // 다음 touchmove 이벤트 핸들러에서 필요한 터치 포인트 Y값을 저장
    movingDirection: "none" | "down" | "up"; // 유저가 터치를 움직이고 있는 방향
  };
  isContentAreaTouched: boolean; // 컨텐츠 영역을 터치하고 있음을 기록
}

export function useBottomSheet({ minY, maxY, minTop }: { minY: number; maxY: number; minTop: number }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  const metrics = useRef<BottomSheetMetrics>({
    touchStart: {
      sheetY: 0,
      touchY: 0,
    },
    touchMove: {
      prevTouchY: 0,
      movingDirection: "none",
    },
    isContentAreaTouched: false,
  });

  // Touch Event 핸들러들을 등록한다.
  useEffect(() => {
    const canUserMoveBottomSheet = () => {
      if (!sheetRef.current) return;
      if (!content.current) return;

      const { touchMove, isContentAreaTouched } = metrics.current;

      // 바텀시트에서 컨텐츠 영역이 아닌 부분을 터치하면 항상 바텀시트를 움직입니다.
      if (!isContentAreaTouched) return true;
      // 바텀시트가 올라와있는 상태가 아닐 때는 컨텐츠 영역을 터치해도 바텀시트를 움직이는 것이 자연스럽습니다.
      if (sheetRef.current.getBoundingClientRect().y !== minY) return true;
      // 스크롤을 더 이상 올릴 것이 없다면, 바텀시트를 움직이는 것이 자연스럽습니다.
      // Safari 에서는 bounding 효과 때문에 scrollTop 이 음수가 될 수 있습니다. 따라서 0보다 작거나 같음 (<=)으로 검사합니다.
      if (touchMove.movingDirection === "down") return content.current.scrollTop <= 0;
      return false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!sheetRef.current) return;
      const { touchStart, touchMove } = metrics.current;

      touchStart.sheetY = sheetRef.current.getBoundingClientRect().y;
      touchStart.touchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!sheetRef.current) return;
      const { touchStart, touchMove } = metrics.current;
      const currentTouch = e.touches[0];

      if (touchMove.prevTouchY === undefined) touchMove.prevTouchY = touchStart.touchY;
      if (touchMove.prevTouchY < currentTouch.clientY) touchMove.movingDirection = "down";
      if (touchMove.prevTouchY > currentTouch.clientY) touchMove.movingDirection = "up";

      if (canUserMoveBottomSheet()) {
        // content에서 scroll이 발생하는 것을 막습니다.
        e.preventDefault();

        // 터치 시작점에서부터 현재 터치 포인트까지의 변화된 y값
        const touchOffset = currentTouch.clientY - touchStart.touchY;
        let nextSheetY = touchStart.sheetY + touchOffset;
        // nextSheetY 는 minY와 maxY 사이의 값으로 clamp 되어야 한다
        if (nextSheetY <= minY) nextSheetY = minY;
        if (nextSheetY >= maxY) nextSheetY = maxY;
        sheetRef.current.style.setProperty("transform", `translateY(${nextSheetY - maxY}px)`); // sheet 위치 갱신.
      } else {
        // 컨텐츠를 스크롤하는 동안에는 body가 스크롤되는 것을 막습니다
        document.body.style.overflowY = "hidden";
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!sheetRef.current) return;

      document.body.style.overflowY = "auto";

      const { touchMove } = metrics.current;
      // Snap Animation
      const currentSheetY = sheetRef.current.getBoundingClientRect().y;
      if (currentSheetY !== minTop) {
        if (touchMove.movingDirection === "down") sheetRef.current.style.setProperty("transform", "translateY(0)");
        if (touchMove.movingDirection === "up")
          sheetRef.current.style.setProperty("transform", `translateY(${minY - maxY}px)`);
      }

      // metrics 초기화.
      metrics.current = {
        touchStart: {
          sheetY: 0,
          touchY: 0,
        },
        touchMove: {
          prevTouchY: 0,
          movingDirection: "none",
        },
        isContentAreaTouched: false,
      };
    };

    sheetRef.current?.addEventListener("touchstart", handleTouchStart);
    sheetRef.current?.addEventListener("touchmove", handleTouchMove);
    sheetRef.current?.addEventListener("touchend", handleTouchEnd);

    return () => {
      sheetRef.current?.removeEventListener("touchstart", handleTouchStart);
      sheetRef.current?.removeEventListener("touchmove", handleTouchMove);
      sheetRef.current?.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // content 영역을 터치하는 것을 기록합니다.
  useEffect(() => {
    const handleTouchStart = () => {
      metrics.current.isContentAreaTouched = true;
    };

    content.current?.addEventListener("touchstart", handleTouchStart);

    return () => content.current?.removeEventListener("touchstart", handleTouchStart);
  }, []);

  return { sheet: sheetRef, content };
}

// interface BottomSheetMetrics {
//   touchStart: {
//     sheetY: number; // touchstart에서 BottomSheet의 최상단 모서리의 Y값
//     touchY: number; // touchstart에서 터치 포인트의 Y값
//   };
//   touchMove: {
//     prevTouchY?: number; // 다음 touchmove 이벤트 핸들러에서 필요한 터치 포인트 Y값을 저장
//     movingDirection: "none" | "down" | "up"; // 유저가 터치를 움직이고 있는 방향
//   };
// }

// export function useBottomSheet({ minY, maxY, minTop }: { minY: number; maxY: number; minTop: number }) {
//   const sheetRef = useRef<HTMLDivElement>(null);

//   const metrics = useRef<BottomSheetMetrics>({
//     touchStart: {
//       sheetY: 0,
//       touchY: 0,
//     },
//     touchMove: {
//       prevTouchY: 0,
//       movingDirection: "none",
//     },
//   });

//   // Touch Event 핸들러들을 등록한다.
//   useEffect(() => {
//     const handleTouchStart = (e: TouchEvent) => {
//       if (!sheetRef.current) return;
//       const { touchStart, touchMove } = metrics.current;

//       touchStart.sheetY = sheetRef.current.getBoundingClientRect().y;
//       touchStart.touchY = e.touches[0].clientY;
//     };

//     const handleTouchMove = (e: TouchEvent) => {
//       if (!sheetRef.current) return;
//       e.preventDefault();

//       const { touchStart, touchMove } = metrics.current;
//       const currentTouch = e.touches[0];

//       if (touchMove.prevTouchY === undefined) touchMove.prevTouchY = touchStart.touchY;
//       if (touchMove.prevTouchY < currentTouch.clientY) touchMove.movingDirection = "down";
//       if (touchMove.prevTouchY > currentTouch.clientY) touchMove.movingDirection = "up";

//       // 터치 시작점에서부터 현재 터치 포인트까지의 변화된 y값
//       const touchOffset = currentTouch.clientY - touchStart.touchY;
//       let nextSheetY = touchStart.sheetY + touchOffset;
//       // nextSheetY 는 minY와 maxY 사이의 값으로 clamp 되어야 한다
//       if (nextSheetY <= minY) nextSheetY = minY;
//       if (nextSheetY >= maxY) nextSheetY = maxY;
//       // sheet 위치 갱신.
//       sheetRef.current.style.setProperty("transform", `translateY(${nextSheetY - maxY}px)`);
//     };

//     const handleTouchEnd = (e: TouchEvent) => {
//       if (!sheetRef.current) return;
//       const { touchMove } = metrics.current;
//       // Snap Animation
//       const currentSheetY = sheetRef.current.getBoundingClientRect().y;
//       if (currentSheetY !== minTop) {
//         if (touchMove.movingDirection === "down") sheetRef.current.style.setProperty("transform", "translateY(0)");
//         if (touchMove.movingDirection === "up")
//           sheetRef.current.style.setProperty("transform", `translateY(${minY - maxY}px)`);
//       }

//       // metrics 초기화.
//       metrics.current = {
//         touchStart: {
//           sheetY: 0,
//           touchY: 0,
//         },
//         touchMove: {
//           prevTouchY: 0,
//           movingDirection: "none",
//         },
//       };
//     };

//     sheetRef.current?.addEventListener("touchstart", handleTouchStart);
//     sheetRef.current?.addEventListener("touchmove", handleTouchMove);
//     sheetRef.current?.addEventListener("touchend", handleTouchEnd);

//     return () => {
//       sheetRef.current?.removeEventListener("touchstart", handleTouchStart);
//       sheetRef.current?.removeEventListener("touchmove", handleTouchMove);
//       sheetRef.current?.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, []);

//   return { sheet: sheetRef };
// }
