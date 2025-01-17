import Head from "next/head";

type Props = {
  tab?: string;
  desc?: string[];
  link?: string;
  title?: string;
};

const SEO = ({ desc, tab, link, title = "스페이스챗" }: Props) => {
  const description = desc?.join(",") || keyword.slice(0, 3).join(",");
  const domainMainName = "스페이스챗";
  const image = "https://space-chat.io/seo_wide.png";
  const tabTitle = tab || "스페이스챗";
  const url = link || "https://space-chat.io/";
  const canonical = "https://space-chat.io";
  const keywords = keyword.slice(0, 6).join(",");

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* SNS Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "Organization",
              name: domainMainName,
              url: canonical,
              sameAs: [
                "https://www.facebook.com/profile.php?id=61550730668176",
                "https://blog.naver.com/spacechat",
                "https://twitter.com/space_chat_io",
                "https://www.youtube.com/channel/UCYzSu61FBUF_BAOhkAItfBg",
              ],
            }),
          }}
        />
        {/* <span itemType="http://schema.org/Organization" itemScope>
        <span itemProp="name">스페이스챗</span>
        <link itemProp="url" href={canonical} />
        <a itemProp="sameAs" href="https://www.facebook.com/profile.php?id=61550730668176" aria-label="Go to facebook">
          Go to facebook
        </a>
        <a itemProp="sameAs" href="https://blog.naver.com/spacechat" aria-label="Go to naver blog">
          Go to naver blog
        </a>
        <a itemProp="sameAs" href="https://twitter.com/space_chat_io" aria-label="Go to twitter">
          Go to twitter
        </a>
        <a itemProp="sameAs" href="https://www.youtube.com/channel/UCYzSu61FBUF_BAOhkAItfBg" aria-label="Go to youtube">
          Go to youtube
        </a>
        </span> */}

        {/* onesinal setting */}
        <link rel="preconnect" href="https://cdn.onesignal.com" />

        <link rel="apple-touch-icon" href="/favicon/ios/50.png" />
        <link rel="apple-touch-icon" href="/favicon/ios/50.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon/ios/152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/ios/180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/favicon/ios/167.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png"
        />
        {/* <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#ffffff" /> */}
        <link rel="shortcut icon" href="/favicon/ios/152.png" />
        {/* favicon */}
        <link rel="apple-touch-icon" sizes="57x57" href="/favicon/ios/57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/favicon/ios/60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon/ios/72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon/ios/76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/favicon/ios/114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon/ios/120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon/ios/144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon/ios/152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/ios/180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="favicon/android/android-launchericon-192-192.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="favicon/android/android-launchericon-48-48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="favicon/android/android-launchericon-96-96.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="favicon/android/android-launchericon-512-512.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/favicon/windows11/LargeTile.scale-200.png" />
        {/* IOS splash meta tag */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="images/splash_screens/12.9__iPad_Pro_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="images/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="images/splash_screens/10.9__iPad_Air_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="images/splash_screens/10.5__iPad_Air_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="images/splash_screens/10.2__iPad_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="images/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          href="images/splash_screens/iPhone_14_Pro_Max_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          href="images/splash_screens/iPhone_14_Pro_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          href="images/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          href="images/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          href="images/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          href="images/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="images/splash_screens/iPhone_11__iPhone_XR_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          href="images/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="images/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="images/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="images/splash_screens/12.9__iPad_Pro_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="images/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="images/splash_screens/10.9__iPad_Air_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="images/splash_screens/10.5__iPad_Air_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="images/splash_screens/10.2__iPad_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="images/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="images/splash_screens/iPhone_14_Pro_Max_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="images/splash_screens/iPhone_14_Pro_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="images/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="images/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="images/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="images/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="images/splash_screens/iPhone_11__iPhone_XR_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="images/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="images/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="images/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png"
        />
        <link rel="manifest" href="/manifest.json" />
        {/* SEO */}
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=2.0,user-scalable=yes, viewport-fit=cover"
        />
        {/* <meta name="theme-color" media="(prefers-color-scheme: light)" content="black" /> */}
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <meta name="supported-color-schemes" content="dark" />
        <meta name="color-scheme" content="dark only" />
        <meta charSet="utf-8" />
        <title>{tabTitle ? tabTitle : title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={title} />
        <meta httpEquiv="content-language" content="ko" />
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="-1" />
        <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
        <meta itemProp="name" content={title} />
        <meta itemProp="image" content={image} />
        <meta itemProp="description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={domainMainName} />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="space-chat.io" />
        <meta name="Daum" content="index,follow" />
        <meta name="robots" content="index,follow" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b3b3b" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <meta name="application-name" content="Space Chat" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta
          name="google-site-verification"
          content="google-site-verification=GqcCsz4WDeoQ3pCTbsbIyMuuO3Kt46NiSUSA0D7L-4Y"
        />
        <meta name="msvalidate.01" content="0DB493391BABFF679EFEB558DABFE894" />
      </Head>
      <h1 style={{ display: "none" }}>{title}</h1>
      <h2 style={{ display: "none" }}>{description}</h2>
      <h3 style={{ display: "none" }}>{keyword}</h3>

      {/* page data */}
    </>
  );
};

export default SEO;

export const keyword = [
  "무료 랜덤 채팅",
  "랜덤 채팅 앱",
  "온라인 랜덤 채팅",
  "랜덤 비디오 채팅",
  "랜덤 채팅 어플",
  "랜덤 채팅 사이트",
  "낯선 사람과의 랜덤 채팅",
  "채팅 룰렛",
  "커뮤니티",
  "소개팅",
  "유료서비스",
  "카메라",
  "쇼핑몰",
  "플랫폼",
  "해외",
  "아이폰 앱",
  "안드로이드 앱",
  "소셜 미디어",
  "기능 추가",
  "소식 및 정보",
  "매칭",
  "영어",
  "인기",
  "유형",
  "게임",
  "방법",
  "일본",
  "대화",
  "인터넷",
  "중국",
  "시스템",
  "유튜브",
  "일반인",
  "영상통화",
  "여성",
  "커플",
  "룸",
  "마케팅",
  "미국",
  "밴드",
  "미팅",
  "스팸",
  "현금",
  "캠핑",
  "레즈비언",
  "이야기",
  "해외친구",
  "온라인게임",
  "취미",
  "알바",
  "클럽하우스",
  "대화팅",
  "대학생",
  "채팅어플",
  "블로그",
  "소통",
  "자위",
  "캐나다",
  "미디어",
  "성인",
  "미팅어플",
  "우정",
  "친구만들기",
  "독일",
];
