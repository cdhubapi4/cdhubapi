import { isApp } from "@/components/util/constant";
import { Html, Head, Main, NextScript } from "next/document";

export default function page() {
  return (
    <Html lang="ko">
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* Google Analytics */}
        {!isApp ? <script async src="https://www.googletagmanager.com/gtag/js?id=G-LD5PF1EN2E" /> : null}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-LD5PF1EN2E');
              `,
          }}
        />
        <meta name="naver-site-verification" content="3b0beddf45ac808e45d6d549b74e4998c1216c09" />
        <link rel="preload" href="/icon/back_arrow.svg" as="image" />
        <link rel="preload" href="/icon/cancel.svg" as="image" />
        <link rel="preload" href="/icon/chat_small_w8.png" as="image" />
        <link rel="preload" href="/icon/ic_comment.svg" as="image" />
        <link rel="preload" href="/icon/ic_dislike_empty.svg" as="image" />
        <link rel="preload" href="/icon/ic_dislike.svg" as="image" />
        <link rel="preload" href="/icon/ic_like_empty_unused.svg" as="image" />
        <link rel="preload" href="/icon/ic_like_empty.svg" as="image" />
        <link rel="preload" href="/icon/ic_like.svg" as="image" />
        <link rel="preload" href="/icon/ic_reply.svg" as="image" />
        <link rel="preload" href="/icon/ic_top.svg" as="image" />
        <link rel="preload" href="/icon/ic_view.png" as="image" />
        <link rel="preload" href="/icon/megaphone.svg" as="image" />
        <link rel="preload" href="/icon/more.svg" as="image" />
        <link rel="preload" href="/icon/search_button.svg" as="image" />
        <link rel="preload" href="/icon/send_message_w18.png" as="image" />
        <link rel="preload" href="/icon/up.svg" as="image" />
        <link rel="preload" href="/icon/ic_star_off.svg" as="image" />
        <link rel="preload" href="/icon/ic_star_on.svg" as="image" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
