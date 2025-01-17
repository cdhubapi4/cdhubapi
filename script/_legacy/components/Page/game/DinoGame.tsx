import Head from "next/head";
import { useEffect } from "react";

const DinoGame: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/lib/dino-game/script.js"; // 여기에 스크립트 파일 경로를 넣으세요
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/lib/dino-game/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </Head>
      <div id="game" className="game">
        <div id="score" className="score">
          0
        </div>
        <div id="start-message" className="start-message">
          Press any key or click to start
        </div>
        <img src="/lib/dino-game/assets/ground.png" className="ground" />
        <img src="/lib/dino-game/assets/ground.png" className="ground" />
        <img src="/lib/dino-game/assets/dino-stationary.png" id="dino" className="dino" />
        <div id="gameover-message" className="gameover-message hide">
          <p>Game over</p>
          <span>Press any key or click to restart</span>
        </div>
      </div>
    </>
  );
};

export default DinoGame;
