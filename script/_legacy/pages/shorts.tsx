import { FullPageScroll } from "@/components/Page/shorts/FullPageScroll";
import { css } from "@emotion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BackHeader } from "./message";
import Hls from "hls.js";
import VideoPlayer from "@/components/Page/shorts/HLSVideoPlayer";
import { videoList } from "@/components/Page/shorts/videoList";
import shuffleArray from "@/components/Page/shorts/shuffleArray";

// 가로
// https://asset-1.space-chat.io/cojff86gtu341z1eqwxv/intro.png
// 재생안됨
// https://asset-1.space-chat.io/uksklksnei4smrgd7xsi/intro.png

const list = shuffleArray(videoList);
const ShortsPage = () => {
  const HLSRef = useRef<(Hls | null)[]>([]);
  const refList = useRef<HTMLVideoElement[]>([]);
  const playIndex = useRef({ index: 0, status: "pause" });
  const mutedDivRef = useRef<HTMLDivElement>(null);
  const isMuted = useRef(false);

  // 비디오 목록 상태
  const [videoList, setVideoList] = useState<string[]>([]);

  /// 비디오 목록 추가
  useEffect(() => {
    const watchedVideos = getWatchedVideos();
    const newVideoList = shuffleArray(list.filter((video) => !watchedVideos.includes(video)));

    // 모든 비디오를 이미 시청한 경우, localStorage를 초기화하고 전체 리스트를 반환합니다.
    if (newVideoList.length === 0) {
      localStorage.removeItem("watchedVideos");
      setVideoList(list);
    } else {
      setVideoList(newVideoList);
    }
  }, []);

  /// 안드로이드 당겨서 새로고침 제거
  useEffect(() => {
    document.body.style.overscrollBehaviorY = "none";
    return () => {
      document.body.style.overscrollBehaviorY = "initial";
    };
  }, []);

  const handleUserInteraction: EventListenerOrEventListenerObject = (e) => {
    e.stopPropagation();

    if (!mutedDivRef.current) return;
    mutedDivRef.current.style.visibility = "hidden";
    mutedDivRef.current.style.opacity = "0";

    const currentVideo = refList.current[playIndex.current.index];
    if (currentVideo.muted) currentVideo.muted = false;

    window.removeEventListener("touchstart", handleUserInteraction);
    window.removeEventListener("mousedown", handleUserInteraction);
  };

  // 이미 본 비디오 목록을 localStorage에서 가져옵니다.
  const getWatchedVideos = () => {
    if (typeof window === "undefined") return [];
    const watchedVideos = window.localStorage.getItem("watchedVideos");
    return watchedVideos ? JSON.parse(watchedVideos) : [];
  };

  // 비디오 시청 시 localStorage에 추가하는 함수입니다.
  const addVideoToWatched = (videoUrl: string) => {
    const watchedVideos = getWatchedVideos();
    if (!watchedVideos.includes(videoUrl)) {
      localStorage.setItem("watchedVideos", JSON.stringify([...watchedVideos, videoUrl]));
    }
  };

  // 페이지 변경 또는 사용자 상호작용에 따른 비디오 재생 관리
  const handlePageChange = (currentIndex: number) => {
    const totalVideos = videoList.length;
    const maxIndex = totalVideos - 1;

    // 이전 및 다음 비디오 일시 정지
    for (let i = 0; i < maxIndex; i++) {
      const video = refList.current[i];
      if (!video.paused) video.pause();
    }

    // 변경되는 페이지에 필요한 인덱스 범위 계산
    const requiredIndices = new Set([currentIndex - 1, currentIndex, currentIndex + 1]);

    // 불필요한 비디오 소스 제거 및 HLS 인스턴스 정리
    HLSRef.current.forEach((hls, i) => {
      if (!requiredIndices.has(i) && hls) {
        hls.destroy();
        HLSRef.current[i] = null;
        const video = refList.current[i];
        if (video) {
          video.src = "";
          video.poster = "";
        }
      }
    });

    // 필요한 비디오에만 소스를 할당
    requiredIndices.forEach((i) => {
      if (i >= 0 && i <= maxIndex && !HLSRef.current[i]) {
        const video = refList.current[i];
        const videoSrc = videoList[i];
        if (video && Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(videoSrc);
          hls.attachMedia(video);
          HLSRef.current[i] = hls;
          video.poster = videoSrc.replace("v_m3u8", "intro.png");
        }
      }
    });

    //start current video
    const currentVideo = refList.current[currentIndex];
    if (currentVideo.muted) currentVideo.muted = false;
    currentVideo
      .play()
      .then(() => {
        if (!mutedDivRef.current) return;
        mutedDivRef.current.style.visibility = "hidden";
        mutedDivRef.current.style.opacity = "0";
        isMuted.current = false;
      })
      .catch((e) => {
        currentVideo.muted = true;
        currentVideo.play();

        if (String(e).includes("interact")) {
          if (!mutedDivRef.current) return;
          mutedDivRef.current.style.visibility = "visible";
          mutedDivRef.current.style.opacity = "1";
          // 화면 탭할시 음소거 제거 시도
          window.addEventListener("touchend", handleUserInteraction, { once: true });
          window.addEventListener("mousedown", handleUserInteraction, { once: true });

          isMuted.current = true;
        }
      });
    playIndex.current = { index: currentIndex, status: "play" };

    // 현재 시청 중인 비디오를 watchedVideos에 추가합니다.
    addVideoToWatched(videoList[currentIndex]);
  };

  // 초기에 첫 번째 비디오 로드
  useEffect(() => {
    if (videoList.length) handlePageChange(0);
  }, [videoList]);

  const onVideoClick = (currentIndex: number) => {
    if (isMuted.current) return (isMuted.current = false);

    const currentVideo = refList.current[currentIndex];

    if (currentVideo.paused) {
      //start current video
      if (currentVideo.muted) currentVideo.muted = false;
      currentVideo
        .play()
        .then(() => {
          if (!mutedDivRef.current) return;
          mutedDivRef.current.style.visibility = "hidden";
          mutedDivRef.current.style.opacity = "0";
          isMuted.current = false;
        })
        .catch((e) => {
          currentVideo.muted = true;
          currentVideo.play();

          if (String(e).includes("interact")) {
            if (!mutedDivRef.current) return;
            mutedDivRef.current.style.visibility = "visible";
            mutedDivRef.current.style.opacity = "1";
            // 화면 탭할시 음소거 제거 시도
            window.addEventListener("touchend", handleUserInteraction, { once: true });
            window.addEventListener("mousedown", handleUserInteraction, { once: true });

            isMuted.current = true;
          }
        });
      playIndex.current = { index: currentIndex, status: "play" };
    } else {
      currentVideo.pause();
      playIndex.current = { index: currentIndex, status: "pause" };
    }
  };

  return (
    <>
      <div
        ref={mutedDivRef}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 1, visibility: "hidden", opacity: 0 }}
      >
        <div css={MutedStyle}>탭하여 음소거 해제</div>
      </div>
      <BackHeader />
      <FullPageScroll onPageChange={handlePageChange}>
        {videoList.map((v, i) => (
          <VideoPlayer
            key={v}
            videoRefList={refList}
            videoIndex={i}
            style={{ width: "100vw", height: "var(--vh)" }}
            poster={i <= 1 ? v.replace("v_m3u8", "intro.png") : ""}
            preload="none"
            autoPlay={false}
            muted={false}
            loop
            onClick={() => onVideoClick(i)}
          >
            <source src={""} type="application/x-mpegURL" />
            Your browser does not support the video tag.
          </VideoPlayer>
        ))}
      </FullPageScroll>
    </>
  );
};

export default ShortsPage;

const MutedStyle = css`
  margin-left: 16px;
  margin-top: 16px;
  width: fit-content;
  color: black;
  background-color: white;
  border: 1px solid black;
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  z-index: 1;
  font-size: 0.6rem;
  font-weight: 500;
  line-height: 100%;
`;
