import { css } from "@emotion/react";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";

const VideoPlayer = ({
  src,
  onClick,
  videoRefList,
  videoIndex,
  ...props
}: React.VideoHTMLAttributes<HTMLVideoElement> & {
  videoRefList: MutableRefObject<HTMLVideoElement[]>;
  videoIndex: number;
}) => {
  const progressRef = useRef<HTMLInputElement | null>(null);
  const playIconRef = useRef<HTMLDivElement | null>(null);
  const [isStop, setIsStop] = useState<boolean | null>(null);

  useEffect(() => {
    setIsStop(false);
  }, []);

  //#region 프로세스바 시간 반영
  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    const { currentTime, duration } = video;
    const val = (currentTime / duration) * 1000; // 값의 범위를 0 - 1000으로 조정
    if (progressRef.current) {
      progressRef.current.style.background = `linear-gradient(to right, red 0%, red ${val / 10}%, #d5d4d3 ${
        val / 10
      }%, #adadad 100%)`;
      progressRef.current.value = String(val);
    }
  };

  useEffect(() => {
    const videoElement = videoRefList.current[videoIndex];
    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate as any);
      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate as any);
      };
    }
  }, [props.id]);
  //#endregion

  const onTogglePlay = () => {
    const videoElement = videoRefList.current[videoIndex];

    if (videoElement && playIconRef.current) {
      if (videoElement.paused) {
        playIconRef.current.className = "video-inner visible";
        setIsStop(true);
      } else {
        playIconRef.current.className = "video-inner disable";
        setIsStop(false);
      }
    }
  };

  const onChangeProgress: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();
    const videoElement = videoRefList.current[videoIndex];

    if (progressRef.current === null || !videoElement) return;

    const val = Number(e.target.value);
    const duration = videoElement.duration;
    videoElement.currentTime = (val / 1000) * duration; // 1000으로 나누어 비디오의 현재 재생 시간을 설정

    progressRef.current.style.background = `linear-gradient(to right, red 0%, red ${val / 10}%, #d5d4d3 ${
      val / 10
    }%, #adadad 100%)`; // 스타일 업데이트
  };
  return (
    <>
      <div css={VideoStyle}>
        <div className="video-play">
          <div ref={playIconRef} className="video-inner disable">
            <PlayIcon />
          </div>
        </div>

        <video
          ref={(r) => {
            if (r) videoRefList.current[videoIndex] = r;
          }}
          {...props}
          onClick={onClick}
          onPlay={onTogglePlay}
          onPause={onTogglePlay}
        >
          <source src={src} type="application/x-mpegURL" />
          Your browser does not support the video tag.
        </video>
        <div
          className="video-bottom"
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <input
            ref={progressRef}
            css={ProgressStyle(isStop)}
            type="range"
            defaultValue={0}
            max={1000}
            onChange={onChangeProgress}
          />
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;

const VideoStyle = css`
  /* video {
    width: 100%;
    height: calc(var(--vh));
  } */

  .video-play {
    width: 0;
    height: 0;
    .video-inner {
      width: 80px;
      height: 80px;
      top: calc(var(--vh) / 2);
      left: 50vw;
      transform: translate(-50%, -50%);
      position: relative;
    }
    .visible {
      opacity: 1;
    }
    .disable {
      opacity: 0;
    }
  }

  .video-bottom {
    position: relative;
    top: -50px;

    .progress-bar {
      width: 0;
      height: 4px;
      background-color: red;
      transition: width 0.4s;
    }

    div {
      position: relative;
      top: -100%;
    }
  }
`;

const PlayIcon = ({ width = 80, height = 80 }) => (
  <svg width={`${width}px`} height={`${height}px`} viewBox="0 0 24 24">
    <path
      d="M 12,2 C 17.52,2 22,6.48 22,12 22,17.52 17.52,22 12,22 6.48,22 2,17.52 2,12 2,6.48 6.48,2 12,2 Z"
      id="circle"
      fill="black"
    ></path>
    <path d="m 9.5,7.5 v 9 l 7,-4.5 z" id="triangle" fill="white"></path>
  </svg>
);

const ProgressStyle = (isStop: boolean | null) => css`
  margin: 0 16px;
  background-color: #eeeeee;
  -webkit-appearance: none;
  width: calc(100% - 32px);
  height: ${isStop ? 3 : 0}px;
  transition: height 0.1s ease-out;
  margin: 12px;
  cursor: pointer;
  border-radius: 0; /* iOS */
  transition: background 450ms ease-in;
  position: relative;
  top: -10px;

  -webkit-tap-highlight-color: transparent;
  tap-highlight-color: transparent;

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: ${isStop ? 20 : 0}px;
    height: ${isStop ? 20 : 0}px;
    transition:
      width 0.1s ease-out,
      height 0.1s ease-out;
    background: red;
    border-radius: 50%;
    /* cursor: pointer; */
  }

  ::-moz-range-thumb {
    -webkit-appearance: none;
    width: ${isStop ? 0 : 20}px;
    height: ${isStop ? 0 : 20}px;
    background: red;
    transition:
      width 0.1s ease-out,
      height 0.1s ease-out;
    border-radius: 50%;
    /* cursor: pointer; */
  }
`;
