import useWindowSize from "@/components/hook/useWindowSize";
import Ripple from "@/components/layout/Ripple";
import SEO from "@/components/layout/SEO";
import { css } from "@emotion/react";
import Container from "@mui/material/Container";
import "animate.css";
import axios from "axios";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { isAndroid, isMobile } from "react-device-detect";

export default function LandingPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { width } = useWindowSize();
  const [isMobileMode, setIsMobileMode] = useState<boolean>(false);

  useEffect(() => {
    // Scroll Animation (sa, 스크롤 애니메이션)
    const saDefaultMargin = 100;
    let saTriggerMargin = 0;
    let saTriggerHeight = 0;

    const saElementList = document.querySelectorAll(".sa");
    const saFunc = function () {
      saElementList.forEach((element: any) => {
        if (!element.classList.contains("show")) {
          saTriggerMargin = saDefaultMargin;

          if (element.dataset.saTrigger) {
            saTriggerHeight =
              document.querySelector(element.dataset.saTrigger).getBoundingClientRect().top + saTriggerMargin;
          } else {
            saTriggerHeight = element.getBoundingClientRect().top + saTriggerMargin;
          }

          if (window.innerHeight > saTriggerHeight) {
            element.classList.add("show");
          }
        }
      });
    };
    setTimeout(() => saFunc(), 200);
    window.addEventListener("scroll", saFunc);
  }, []);

  useEffect(() => {
    setIsMobileMode(isMobile || (width && width <= 900) ? true : false);
  }, [width]);

  const onClickSubscribe = async () => {
    const input = inputRef.current;
    if (!input || !input.value) return;

    // email-check regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = input.value;
    if (!emailRegex.test(email)) return alert("유효하지 않은 이메일 주소입니다.");

    // delete input and save in DB
    input.value = "";
    await axios.get(`api/user-email?email=${email}`).then((d) => d.data.result);
  };

  return (
    <>
      <SEO
        tab="스페이스챗 | 랜덤채팅 & 핫 커뮤니티 - Space-Chat.io"
        title="스페이스챗 | 랜덤채팅 & 핫 커뮤니티 - Space-Chat.io"
      />
      <Head>
        <style>
          {`
            body {
              overflow-x: hidden;
            }
          `}
        </style>
      </Head>
      <div css={LandingStyle(isMobileMode)}>
        <div className="header_deco">
          <img src="/landing/header_deco.png" width="365.115px" height="303.515px" />
        </div>

        <Container maxWidth="lg">
          <header>
            <button className="logo" onClick={() => (window.location.href = "/")}>
              <img src="/favicon/ios/128.png" width="32px" height="32px" />
              <Ripple />
            </button>

            <button className="btn sm-txt" onClick={() => (window.location.href = "/")}>
              시작하기
              <Ripple />
            </button>
          </header>
          <section className="main sa sa-up">
            <div className="left" style={{ textAlign: !isMobileMode ? undefined : "center" }}>
              <div className="header_deco_left">
                <img src="/landing/main_deco_left.png" width="400px" height="332.52px" />
              </div>
              <div className="tag" style={{ justifyContent: !isMobileMode ? undefined : "center" }}>
                <div>#No signup</div>
                <div>#chat</div>
                <div>#free</div>
                <div>#No Phone SMS Auth</div>
              </div>
              <div className="title">Anonymous Free Random Chat</div>
              You can enjoy random chat for free
              <br /> <b>without signin(login)/authentication.</b>
              {isMobileMode && (
                <img
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    marginTop: 20,
                  }}
                  src="/landing/main_phone_image.png"
                  height="463px"
                />
              )}
              <div
                className="check-list"
                style={{
                  width: "100%",
                  flex: 1,
                  justifyContent: !isMobileMode ? undefined : "center",
                  display: "flex",
                }}
              >
                <div>
                  <img src="/landing/check_arrow.png" width="9px" height="6px" />
                  No Signup
                </div>
                <div>
                  <img src="/landing/check_arrow.png" width="9px" height="6px" />
                  No Phone SMS Auth
                </div>
                <div>
                  <img src="/landing/check_arrow.png" width="9px" height="6px" />
                  No Paid
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: !isMobileMode ? "1vw" : 0,
                    justifyContent: !isMobileMode ? undefined : "center",
                    flexDirection: !isMobileMode ? "row" : "column",
                    alignItems: "center",
                  }}
                >
                  <button onClick={() => (window.location.href = "/")}>
                    웹(.io) 바로가기
                    <Ripple />
                  </button>
                  <button
                    onClick={() => window.open("https://play.google.com/store/apps/details?id=io.spacechat")}
                    // onClick={() => (window.location.href = "/android/spacechat-io.apk")}
                    style={{ background: "rgb(25,195,125)" }}
                  >
                    안드로이드(apk) 앱 다운로드
                    <Ripple />
                  </button>
                </div>
                {isMobileMode && (
                  <img src="/android-app-qr.png" width="128px" style={{ alignSelf: "center", marginTop: 8 }} />
                )}
              </div>
            </div>

            <div className="right">
              {!isMobileMode && (
                <>
                  <div className="header_deco_right">
                    <img src="/landing/main_deco_right.png" width="551.64px" height="563.37px" />
                  </div>
                  <img src="/landing/main_phone_image.png" width="338.39px" height="663px" />
                </>
              )}
            </div>
          </section>

          <hr />
          <section className="desc sa sa-up">
            <div className="desc_deco_right">
              <img src="/landing/desc_deco_right.png" width="365.115px" height="303.515px" />
            </div>
            <div className="tag">UI/UX</div>
            <div className="desc_deco_left">
              <img src="/landing/main_deco_right.png" width="551.64px" height="563.37px" />
            </div>
            <div className="title">Enjoy chatting easily with a simple UI.</div>
            <ul className="image-list">
              <li>
                <img src="/landing/desc_phone_image_1.png" alt="home" />
                <div>home page</div>
              </li>

              <li>
                <img src="/landing/desc_phone_image_2.png" alt="chat-room-list" />
                <div>chat-room list page</div>
              </li>
              <li>
                <img src="/landing/desc_phone_image_3.png" alt="message-list" />
                <div>message list page</div>
              </li>
              <li>
                <img src="/landing/desc_phone_image_4.png" alt="settings" />
                <div>settings page</div>
              </li>
            </ul>
          </section>
          <hr />
          {!isMobileMode ? (
            <section className="desc-detail sa sa-up" data-sa-margin="500">
              <div className="row">
                <div className="column">
                  <img src="/landing/desc_detail_icon_1.png" width="64px" height="64px" />
                  <div className="column-title">No Profile</div>
                  <div className="column-desc">
                    이 앱은 랜덤 채팅을 제공하는 애플리케이션입니다. 사용자는 이 앱을 통해 전 세계 어디에서든 다른
                    사람들과 연결되어 대화를 할 수 있습니다. 이러한 채팅은 완전히 익명으로 이루어지며, 상대방의
                    프로필이나 신원에 대한 정보는 공개되지 않습니다.
                  </div>
                </div>
                <div className="column">
                  <img src="/landing/desc_detail_icon_2.png" width="64px" height="64px" />
                  <div className="column-title">Community</div>
                  <div className="column-desc">
                    이 앱은 사람들이 새로운 사람들을 만나고 소통하는 것을 도와줍니다. 랜덤으로 매칭되는 상대방과 대화를
                    통해 다양한 관점과 문화를 경험할 수 있습니다. 이는 사회적 연결성을 강화하고, 사람들 간의 이해와
                    협력을 촉진하는 데 도움을 줄 수 있습니다.
                  </div>
                </div>
                <div className="column">
                  <img src="/landing/desc_detail_icon_3.png" width="64px" height="64px" />
                  <div className="column-title">New People</div>
                  <div className="column-desc">
                    이 앱은 사용자들에게 새로운 관심사나 지식을 발견하는 기회를 제공합니다. 다른 사람들과의 대화를 통해
                    새로운 아이디어를 얻을 수 있으며, 다양한 주제에 대해 자유롭게 논의할 수 있습니다. 이를 통해
                    사용자들은 자신의 시야를 넓히고, 새로운 정보를 습득할 수 있습니다.
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <img src="/landing/desc_detail_icon_4.png" width="64px" height="64px" />
                  <div className="column-title">Online</div>
                  <div className="column-desc">
                    랜덤 채팅 앱은 현대 사회에서 인간적인 상호작용과 소통의 중요성을 강조하는 플랫폼으로, 다양한
                    사람들과 연결되어 더욱 다양하고 풍부한 대화 경험을 즐길 수 있습니다. 이 앱을 통해 세계 각지의
                    사람들과 연결되어 새로운 인연을 만들거나, 그들과의 대화를 통해 자기계발과 지식 습득에 도움을 받을 수
                    있습니다.
                  </div>
                </div>
                <div className="column">
                  <img src="/landing/desc_detail_icon_5.png" width="64px" height="64px" />
                  <div className="column-title">Free</div>
                  <div className="column-desc">
                    많은 소개팅 앱들이 유료 구독 모델을 채택하고 있지만, 이 앱은 사용자들에게 추가 비용 없이 랜덤 채팅
                    기능을 제공합니다.
                    <br />
                    무료로 채팅을 사용할 수 있음으로써, 사용자들은 다른 사람들과 소통하고 연결하는 과정에서 장벽이나
                    제한을 경험하지 않습니다. 이는 더 많은 사람들이 이 앱을 이용하여 새로운 인연을 만들고 다양한 관계를
                    형성할 수 있도록 도와줍니다.
                  </div>
                </div>
                <div className="column">
                  <img src="/landing/desc_detail_icon_6.png" width="64px" height="64px" />
                  <div className="column-title">Support for Email</div>
                  <div className="column-desc">
                    문제가 발생했나요? 이메일로 운영자에게 알려주세요!
                    <br />
                    <br />
                    <a
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                      onClick={() =>
                        window.open(
                          `mailto:spacechat-io@proton.me?subject=Spacechat 문의&body=여기에 문의 내용을 입력해주세요.`
                        )
                      }
                    >
                      <i>spacechat-io@proton.me</i>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="desc-detail sa sa-up" data-sa-margin="500">
              <div className="row">
                <div className="column">
                  <img src="/landing/desc_detail_icon_1.png" width="64px" height="64px" />
                  <div className="column-title">No Profile</div>
                  <div className="column-desc">
                    이 앱은 랜덤 채팅을 제공하는 애플리케이션입니다. 사용자는 이 앱을 통해 전 세계 어디에서든 다른
                    사람들과 연결되어 대화를 할 수 있습니다. 이러한 채팅은 완전히 익명으로 이루어지며, 상대방의
                    프로필이나 신원에 대한 정보는 공개되지 않습니다.
                  </div>
                </div>
                <div className="column">
                  <img src="/landing/desc_detail_icon_2.png" width="64px" height="64px" />
                  <div className="column-title">Community</div>
                  <div className="column-desc">
                    이 앱은 사람들이 새로운 사람들을 만나고 소통하는 것을 도와줍니다. 랜덤으로 매칭되는 상대방과 대화를
                    통해 다양한 관점과 문화를 경험할 수 있습니다. 이는 사회적 연결성을 강화하고, 사람들 간의 이해와
                    협력을 촉진하는 데 도움을 줄 수 있습니다.
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <img src="/landing/desc_detail_icon_3.png" width="64px" height="64px" />
                  <div className="column-title">New People</div>
                  <div className="column-desc">
                    이 앱은 사용자들에게 새로운 관심사나 지식을 발견하는 기회를 제공합니다. 다른 사람들과의 대화를 통해
                    새로운 아이디어를 얻을 수 있으며, 다양한 주제에 대해 자유롭게 논의할 수 있습니다. 이를 통해
                    사용자들은 자신의 시야를 넓히고, 새로운 정보를 습득할 수 있습니다.
                  </div>
                </div>
                <div className="column">
                  <img src="/landing/desc_detail_icon_4.png" width="64px" height="64px" />
                  <div className="column-title">Online</div>
                  <div className="column-desc">
                    랜덤 채팅 앱은 현대 사회에서 인간적인 상호작용과 소통의 중요성을 강조하는 플랫폼으로, 다양한
                    사람들과 연결되어 더욱 다양하고 풍부한 대화 경험을 즐길 수 있습니다. 이 앱을 통해 세계 각지의
                    사람들과 연결되어 새로운 인연을 만들거나, 그들과의 대화를 통해 자기계발과 지식 습득에 도움을 받을 수
                    있습니다.
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <img src="/landing/desc_detail_icon_5.png" width="64px" height="64px" />
                  <div className="column-title">Free</div>
                  <div className="column-desc">
                    많은 소개팅 앱들이 유료 구독 모델을 채택하고 있지만, 이 앱은 사용자들에게 추가 비용 없이 랜덤 채팅
                    기능을 제공합니다.
                    <br />
                    무료로 채팅을 사용할 수 있음으로써, 사용자들은 다른 사람들과 소통하고 연결하는 과정에서 장벽이나
                    제한을 경험하지 않습니다. 이는 더 많은 사람들이 이 앱을 이용하여 새로운 인연을 만들고 다양한 관계를
                    형성할 수 있도록 도와줍니다.
                  </div>
                </div>
                <div className="column">
                  <img src="/landing/desc_detail_icon_6.png" width="64px" height="64px" />
                  <div className="column-title">Support for Email</div>
                  <div className="column-desc">
                    문제가 발생했나요? 이메일로 운영자에게 알려주세요!
                    <br />
                    <br />
                    <a
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                      onClick={() =>
                        window.open(
                          `mailto:spacechat-io@proton.me?subject=Spacechat 문의&body=여기에 문의 내용을 입력해주세요.`
                        )
                      }
                    >
                      <i>spacechat-io@proton.me</i>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}
          <hr />
          <section className="review sa sa-up">
            <div className="title">Service Review</div>
            <div className="desc">Collecting user and employee insights, crafting greatness together.</div>
            {!isMobileMode ? (
              <ul>
                <li>
                  <img alt="review-profile" src="/landing/review_avatar_1.png" width="60px" height="48px" />
                  <div className="review-desc">
                    — 우리는 사용자 친화적이고 직관적인 디자인의 랜덤 채팅 앱을 개발하고 있습니다. 이 앱은 편리한
                    UI/UX와 자동 매칭, 안전성과 개인정보 보호를 강조하여 사용자들에게 최고의 채팅 경험을 제공합니다.
                  </div>
                  <div className="line" />
                  <div className="review-name">
                    Isabella Garcia<div>&nbsp;/&nbsp;</div>
                    <strong>UX Board</strong>
                  </div>
                </li>
                <li>
                  <img alt="review-profile" src="/landing/review_avatar_2.png" width="60px" height="48px" />
                  <div className="review-desc">
                    — 우리는 현재 Android, iOS, 및 Windows 플랫폼을 통합한 다양한 플랫폼을 대상으로 개발을 진행하고
                    있습니다. 사용자들은 어떤 기기든지 간에 일관된 경험을 누릴 수 있으며, 어떤 플랫폼이더라도 우리의
                    랜덤 채팅 앱을 자유롭게 이용할 수 있습니다.
                  </div>
                  <div className="line" />
                  <div className="review-name">
                    Liam Patel<div>&nbsp;/&nbsp;</div>
                    <strong>Android/iOS Developer</strong>
                  </div>
                </li>
                <li>
                  <img alt="review-profile" src="/landing/review_avatar_3.png" width="60px" height="48px" />
                  <div className="review-desc">
                    — 우리는 무료로 제공되는 서비스와 사용자의 익명성을 보장하는 서비스를 위해 개발을 진행하고 있습니다.
                    사용자들은 비용 부담 없이 우리의 플랫폼을 자유롭게 이용하며, 동시에 개인 정보 보호와 익명성을 유지할
                    수 있습니다.
                  </div>
                  <div className="line" />
                  <div className="review-name">
                    Aarav Sharma<div>&nbsp;/&nbsp;</div>
                    <strong>CTO</strong>
                  </div>
                </li>
              </ul>
            ) : (
              <>
                <ul>
                  <li>
                    <img alt="review-profile" src="/landing/review_avatar_1.png" width="60px" height="48px" />
                    <div className="review-desc">
                      — 우리는 사용자 친화적이고 직관적인 디자인의 랜덤 채팅 앱을 개발하고 있습니다. 이 앱은 편리한
                      UI/UX와 자동 매칭, 안전성과 개인정보 보호를 강조하여 사용자들에게 최고의 채팅 경험을 제공합니다.
                    </div>
                    <div className="line" />
                    <div className="review-name">
                      Isabella Garcia<div>&nbsp;/&nbsp;</div>
                      <strong>UX Board</strong>
                    </div>
                  </li>
                </ul>
                <ul>
                  <li>
                    <img alt="review-profile" src="/landing/review_avatar_2.png" width="60px" height="48px" />
                    <div className="review-desc">
                      — 우리는 현재 Android, iOS, 및 Windows 플랫폼을 통합한 다양한 플랫폼을 대상으로 개발을 진행하고
                      있습니다. 사용자들은 어떤 기기든지 간에 일관된 경험을 누릴 수 있으며, 어떤 플랫폼이더라도 우리의
                      랜덤 채팅 앱을 자유롭게 이용할 수 있습니다.
                    </div>
                    <div className="line" />
                    <div className="review-name">
                      Liam Patel<div>&nbsp;/&nbsp;</div>
                      <strong>Android/iOS Developer</strong>
                    </div>
                  </li>
                </ul>
                <ul>
                  <li>
                    <img alt="review-profile" src="/landing/review_avatar_3.png" width="60px" height="48px" />
                    <div className="review-desc">
                      — 우리는 무료로 제공되는 서비스와 사용자의 익명성을 보장하는 서비스를 위해 개발을 진행하고
                      있습니다. 사용자들은 비용 부담 없이 우리의 플랫폼을 자유롭게 이용하며, 동시에 개인 정보 보호와
                      익명성을 유지할 수 있습니다.
                    </div>
                    <div className="line" />
                    <div className="review-name">
                      Aarav Sharma<div>&nbsp;/&nbsp;</div>
                      <strong>CTO</strong>
                    </div>
                  </li>
                </ul>
              </>
            )}
          </section>
          <hr />
          <section className="subs sa sa-up">
            <div className="box" style={{ display: isMobileMode ? "block" : undefined }}>
              <div className="left" style={{ marginBottom: isMobileMode ? 20 : 0 }}>
                <div className="title">Subscribe to receive new news</div>
                <div className="desc">Join our newsletter to get top news before anyone else.</div>
              </div>
              <div className="right">
                <input placeholder="Your best email…" ref={inputRef} maxLength={255} />
                <button onClick={onClickSubscribe} style={{ background: "white" }}>
                  Subscribe
                  <Ripple />
                </button>
              </div>
            </div>
          </section>
        </Container>
        <footer>
          <div>
            © 2023 <b>space-chat.io</b> All rights reserved
          </div>
        </footer>
      </div>
    </>
  );
}

const LandingStyle = (isMobileMode: boolean) => css`
  .desc_deco_right {
    position: absolute;
    /* width: 0; */
    /* height: 0; */
    right: 0;
    z-index: -1;
    img {
      width: 46.0422446406053vw;
      object-position: right center;
    }
  }
  .desc_deco_left {
    position: relative;
    width: 0;
    height: 0;
    top: 5vw;
    left: -23%;
    z-index: -1;
    transform: scale(0.8);
    img {
      width: 69.562421185372vw;
      object-position: right center;
    }
  }
  .header_deco_left {
    position: relative;
    width: 0;
    height: 0;
    top: 260px;
    left: -30%;
    z-index: -1;
    img {
      width: 50.441361916771754vw;
      object-position: left center;
    }
  }

  .header_deco_right {
    position: relative;
    width: 0;
    height: 0;
    top: 5%;
    left: -30%;
    z-index: -1;
    .header_deco_right > img {
      width: 69.56368221941993vw;
      object-position: center center;
    }
  }

  hr {
    height: 1px;
    background-color: #33363a;
    border: none;
    max-width: calc(100% - 100px);
    position: relative;
    left: 50px;
    margin: 0;
    padding: 0;
  }
  footer {
    margin: 80px 0 0 0;
    padding: 14px 0;
    display: flex;
    justify-content: center;
    background-color: #141516;
    font-family: "Inter";
    font-style: normal;
    font-weight: 400;
    font-size: 0.6666666666666666rem;
    line-height: normal;
    color: #9ba9b4;
  }
  section.subs {
    background-color: #5d5dff;
    margin: 80px 4% 0 4%;
    padding: min(10vw, 64px) min(7.5vw, 48px);
    .box {
      display: flex;
      flex-direction: row;
      gap: 32px;
      .left {
        .title {
          font-family: "Inter";
          font-style: normal;
          font-weight: 700;
          font-size: 1.5238095238095237rem;
          line-height: normal;
          letter-spacing: -0.25px;
          color: #ffffff;
        }
        .desc {
          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          font-size: 0.8571428571428571rem;
          line-height: normal;
          letter-spacing: -0.25px;
          color: #e2e1ff;

          margin-top: 8px;
        }
      }
      .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
        input {
          background: #4b4acf;
          border: 1px solid #8d8dff;
          border-radius: 2px;
          padding: 12px 16px;

          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          font-size: 0.7619047619047619rem;
          line-height: normal;
          letter-spacing: -0.25px;
          color: #fff;

          flex: 1;
          width: 100%;
        }
        input:focus {
          outline: none;
        }
        input::placeholder {
          color: #ababff;
        }
        button {
          padding: 12px min(2vw, 32px);
          font-family: "Inter";
          font-style: normal;
          font-weight: bold;
          font-size: 0.7619047619047619rem;
          line-height: normal;
          letter-spacing: -0.25px;
          color: #5d5dff;
        }
      }
    }
  }
  section.review {
    background: linear-gradient(
      90deg,
      rgba(32, 32, 35, 0) 0%,
      rgba(32, 32, 35, 0) 0.01%,
      rgba(37, 37, 37, 0.2) 44.27%,
      rgba(32, 32, 35, 0) 100%
    );
    margin: 0 4% 0 4%;
    padding-bottom: 120px;

    .title {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji";
      font-style: normal;
      font-weight: 800;
      font-size: 1.9047619047619047rem;
      line-height: normal;
      text-align: center;
      letter-spacing: -0.5px;
      color: #d9e3ea;

      padding-top: 80px;
    }
    .desc {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji";
      font-style: normal;
      font-weight: 400;
      font-size: 0.9523809523809523rem;
      line-height: normal;
      text-align: center;
      letter-spacing: -0.25px;
      color: #9ba9b4;

      margin-top: 16px;
    }

    ul {
      display: flex;
      flex-direction: row;
      padding: 0 20px;
      margin: 64px 0 0 0;
      gap: 4%;
      list-style: none;
      li {
        height: fit-content;
        flex: 1;
        background-color: #25282c;
        padding: 24px 24px 20px 24px;
        display: flex;
        flex-direction: column;
        .review-desc {
          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          font-size: 0.8571428571428571rem;
          line-height: normal;
          letter-spacing: -0.25px;
          color: #9ba9b4;

          margin-top: 16px;
        }
        .line {
          width: 100%;
          height: 1px;
          background-color: #33363a;
          margin: 24px 0 20px 0;
        }
        .review-name {
          font-family: "Inter";
          font-style: normal;
          font-weight: 500;
          font-size: 0.7619047619047619rem;
          line-height: normal;
          letter-spacing: -0.25px;
          color: #d9e3ea;
          display: flex;
          div {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif,
              "Apple Color Emoji", "Segoe UI Emoji";
            font-style: normal;
            font-weight: 400;
            font-size: 0.7619047619047619rem;
            line-height: normal;
            letter-spacing: -0.25px;
            color: #33363a;
          }
          strong {
            font-weight: 500;
            color: #5d5dff;
          }
        }
      }
    }
  }
  section.desc-detail {
    margin: 70px 4% 80px 4%;
    display: flex;
    flex-direction: column;
    gap: 58px;
    .row {
      display: flex;
      gap: 20px;
      .column {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .column-title {
          font-family: "Inter";
          font-style: normal;
          font-weight: 700;
          font-size: 1.1428571428571428rem;
          line-height: normal;
          text-align: center;
          letter-spacing: -0.25px;
          color: #d9e3ea;

          margin-top: 16px;
        }
        img {
          width: 15.575565831102459vw;
        }
        .column-desc {
          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          font-size: 0.8571428571428571rem;
          line-height: normal;
          text-align: center;
          letter-spacing: -0.25px;
          color: #9ba9b4;

          margin-top: 8px;
        }
      }
    }
  }
  section.desc {
    background: linear-gradient(
      90deg,
      rgba(32, 32, 35, 0) 0%,
      rgba(32, 32, 35, 0) 0.01%,
      rgba(37, 37, 37, 0.2) 44.27%,
      rgba(32, 32, 35, 0) 100%
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    .tag {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji";
      font-style: normal;
      font-weight: 600;
      font-size: 0.6666666666666666rem;
      line-height: normal;
      color: #4536a2;

      padding: 4px 10px;

      background: #d0c6f6;
      box-shadow: 0px 1px 3px rgba(25, 32, 44, 0.04);
      border-radius: 15px;

      margin-top: 74px;
    }
    .title {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji";
      font-style: normal;
      font-weight: 800;
      font-size: 1.9047619047619047rem;
      line-height: normal;
      display: flex;
      align-items: center;
      text-align: center;
      letter-spacing: -0.5px;
      color: #d9e3ea;

      margin-top: 4px;
    }
    .image-list {
      display: flex;
      flex-direction: row;
      padding: 0 20px;
      margin: 64px 0 80px 0;
      gap: 4%;
      list-style: none;
      li {
        flex: 1;
        img {
          width: 100%;
        }
        div {
          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          font-size: 0.9523809523809523rem;
          line-height: normal;
          display: flex;
          align-items: center;
          text-align: center;
          letter-spacing: -0.25px;
          color: #d9e7ea;

          width: 100%;
          justify-content: center;

          margin-top: 8px;
        }
      }
    }
  }
  section.main {
    margin: ${isMobileMode ? "0 0 80px 0" : "100px 0 60px 0"};
    display: flex;
    justify-content: space-evenly;
    .left {
      display: flex;
      flex-direction: column;
      margin-top: 70px;
      .tag {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji";
        font-style: normal;
        font-weight: 600;
        font-size: 0.6666666666666666rem;
        line-height: normal;
        color: #36a269;
        display: flex;
        gap: 8px;
        div {
          background-color: #c6f6d5;
          border-radius: 15px;
          padding: 4px 10px;
          white-space: pre;
        }
      }
      .title {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji";
        font-style: normal;
        font-weight: 800;
        font-size: ${isMobileMode ? "3.3333333333333335" : "1.7"}rem;
        line-height: ${isMobileMode ? "4.285714285714286" : "2.807792207792208"}rem;
        letter-spacing: -0.5px;
        background: linear-gradient(95.44deg, #d9e7ea 11.28%, #2e5cff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .desc {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji";
        font-style: normal;
        font-weight: 400;
        font-size: 0.9523809523809523rem;
        line-height: normal;
        letter-spacing: -0.25px;
        color: #9ba9b4;

        margin-top: 14px;
      }
      .check-list {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji";
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: normal;
        letter-spacing: -0.25px;
        color: #a29e9b;

        margin-top: 28px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        img {
          margin-right: 8px;
        }
      }
      button {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji";
        font-style: normal;
        font-weight: 500;
        font-size: 0.7619047619047619rem;
        line-height: normal;
        display: flex;
        align-items: center;
        text-align: center;
        letter-spacing: -0.25px;
        color: #ffffff;

        background: #5d5dff;
        box-shadow: 0px 10px 15px -3px rgba(21, 23, 25, 0.16);
        border-radius: 2px;

        margin-top: 26px;
        padding: 12px 30px;
        width: fit-content;
      }
    }
  }
  .header_deco {
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: -1;
    img {
      width: 46.0422446406053vw;
      object-position: right top;
    }
  }
  .logo {
    background-color: rgb(21, 23, 25);
    border-radius: 100px;
    width: 32px;
    height: 32px;
    padding: 0;
    img {
      border-radius: 100px;
    }
  }
  header {
    display: flex;
    width: 100%;
    top: 0;
    justify-content: space-between;
    margin-top: 20px;
  }
  .sm-txt {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji";
    font-style: normal;
    font-weight: 500;
    font-size: 0.7619047619047619rem;
    line-height: normal;
    /* identical to box height, or 150% */

    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: -0.25px;
    color: #ffffff;
  }
  .btn {
    background: #5d5dff;
    box-shadow: 0px 1px 3px rgba(25, 32, 44, 0.04);
    border-radius: 2px;
    padding: 8px 18px;
  }
  img {
    object-fit: contain;
  }
  img.resize {
    width: 100%;
    object-fit: contain;
  }
`;
