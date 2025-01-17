import CamperestBanner from "@/components/Page/banner/CamperestBanner";
import { MessageCard } from "@/components/Page/chat/MessageCard";
import { MessageListStyle, MessageType } from "@/components/Page/chat/MessageList";
import { CommunityRoomType } from "@/components/Page/community/CommunityRoomList";
import { TopButton } from "@/components/Page/community/TopButton";
import Container from "@/components/layout/Header/Container";
import { Style } from "@/components/layout/Header/Header.style";
import Ripple from "@/components/layout/Ripple";
import SEO from "@/components/layout/SEO";
import { PRODUCTION_URL } from "@/components/util/constant";
import { UserDataType, getUserData } from "@/components/util/getUserData";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import useSWR from "swr";

export default function ArchivePage({
  title,
  desc,
  thread_id,
  userData,
}: {
  title: string;
  desc: string;
  thread_id: number;
  userData: UserDataType;
}) {
  const router = useRouter();

  const { data: roomData } = useSWR<CommunityRoomType>(`/api/thread-public-read?thread_id=${thread_id}`);
  const { data: messageList } = useSWR<MessageType[]>(`/api/thread-public-read-letter?thread_id=${thread_id}`);

  useEffect(() => {
    document.body.style.overscrollBehavior = "contain";
  }, []);

  if (!roomData)
    return (
      <SEO
        tab={`${title} | 아카이브 | 스페이스챗`}
        desc={[desc]}
        link={typeof window === "undefined" ? "https://space-chat.io/" : window.location.href}
      />
    );

  return (
    <>
      <SEO
        tab={`${title} | 아카이브 | 스페이스챗`}
        desc={[desc]}
        link={typeof window === "undefined" ? "https://space-chat.io/" : window.location.href}
      />
      <Container>
        <nav css={[Style, { paddingBottom: 5 }]}>
          <div className="header-top-container">
            <button className="header-left" style={{ marginLeft: 0 }} onClick={() => router.push("/")}>
              <div style={{ minWidth: 46 - 12, padding: "5px 0" }}>
                <div className="header-back">
                  <Image width={8} height={16} src="/icon/back_arrow.svg" alt="back" />
                  <div style={{ marginTop: 1 }}>전체</div>
                </div>
              </div>
              <Ripple />
            </button>
            <button className="header-center" disabled>
              <div className="ellipse-1" style={{ justifyContent: "center", width: "100%", position: "relative" }}>
                <span style={{ fontSize: "0.9230769230769231rem", marginRight: 4 }}>{roomData.profile_emoji}</span>
                <span style={{ position: "relative", top: -1 }}>{title}</span>
              </div>
            </button>
            <button
              className="header-right"
              style={{
                opacity: 1,
                visibility: "visible",
                minWidth: 46,
                marginRight: 10,
              }}
              onClick={() => router.push("/search?y=&d=title&query=&page=1")}
            >
              <div style={{ padding: "5px 0" }}>검색</div>
              <Ripple />
            </button>
          </div>
        </nav>

        <div css={[Style, MessageListStyle]} ref={(r) => r?.scrollTo({ top: 10000000 })} id="community-message-detail">
          <div id="chat-list" style={{ paddingBottom: window.innerHeight / 4 - 60 }}>
            {!messageList ? (
              <Skeleton
                count={1}
                borderRadius={10}
                height={window.innerHeight / 2 + 50}
                baseColor="#21212D"
                highlightColor="#2C2C36"
                width={"min(570px, 100vw - 30px)"}
                style={{ border: "1px solid #272742", marginLeft: 10 }}
              />
            ) : (
              messageList.map((message, i) => (
                <MessageCard key={i} message={message} chatBackgroundColor={i % 2 === 0 ? "#1E1E29" : undefined} />
              ))
            )}
            {/* <LikeSection room={roomData} setRoom={setRoomData} /> */}
            <CamperestBanner utm_term="archive" style={{ marginTop: 140, paddingBottom: 24, maxWidth: "100%" }} />
          </div>

          <TopButton elementId="community-message-detail" bottom={40} />
        </div>
      </Container>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  const thread_id = Number(id) / 183;

  const { req, res } = context;
  // 쿠키 검사 및 유저 데이터 추출 & 새 유저 만들기
  const userData = await getUserData(res, req);

  const data = await axios.get(`${PRODUCTION_URL}/api/seo-archive-read?id=${thread_id}`).then((d) => d.data.result);

  const seoData =
    data.length > 0 && data[0].length > 0 ? data[0][0] : { title: "", content: "", last_index: 0, is_deleted: 1 };
  const roomData =
    data.length > 1 && data[1] && data[1].length > 0
      ? data[1][0]
      : {
          thread_id: 0,
          title: "",
          content: "",
          tag: "",
          created_user_id: 0,
          view: 0,
          person_like_count: 0,
          person_dislike_count: 0,
          comment_count: 0,
          modified_at: "",
          last_index: 0,
          profile_emoji: "",
          main_index: 0,
          created_at: "",
        };
  const messageList = data.length > 2 ? data[2] : [];

  if ((seoData && seoData.is_deleted == 1) || roomData === null)
    return { redirect: { destination: `/`, permanent: false } };
  const title = seoData.title;
  const desc = ((seoData.content || "") + (messageList[0].content || "") + (messageList[1].content || "")).slice(0, 80);
  return { props: { title, desc, thread_id, userData } };
}
