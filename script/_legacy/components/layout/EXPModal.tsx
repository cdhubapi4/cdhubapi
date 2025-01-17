// import { commentTitleStyle } from "@/components/Page/community/CommunityMessageList";
// import { LevelText } from "@/components/Page/main/LevelText";
// import { css } from "@emotion/react";
// import Image from "next/image";
// import { isMobile } from "react-device-detect";
// import { useRecoilValue } from "recoil";
// import { UserState } from "../recoil/UserState";
// import { t } from "../util/translate";
// import { UserLevelAddExpResponse } from "@/pages/api/user-level-add-exp";
// import { AxiosResponse } from "axios";

// export const defalutModalProps = (
//   d: AxiosResponse,
//   setModal: (valOrUpdater: JSX.Element | ((currVal: JSX.Element | null) => JSX.Element | null) | null) => void
// ): Props => {
//   const { title, description, earnedExp, max, beforeExp, isLevelUp, beforeLevel, currentLevel } = d.data
//     .result as UserLevelAddExpResponse;

//   return {
//     type: isLevelUp ? "levelUp" : "event",
//     title: title,
//     desc: description,
//     earnedExp: earnedExp,
//     onCancel: () => setModal(null),
//     onBtnClick: () => setModal(null),
//     maxExp: max,
//     beforeExp: beforeExp,
//     isLevel: isLevelUp,
//     beforeLevel: beforeLevel,
//     currentLevel: currentLevel,
//   };
// };

// type Props = {
//   type: "event" | "exp" | "levelUp";
//   title: string;
//   desc: string | null;
//   earnedExp: number;
//   beforeExp: number;
//   maxExp: number;
//   isLevel?: boolean;
//   btnText?: string;
//   onCancel: () => void;
//   onBtnClick: () => void;
//   beforeLevel: number;
//   currentLevel: number;
// };
// /**
//  * @example const setModal = useSetRecoilState(ModalState);
//  * @example setModal(<EXPModal title="첫방문" desc="안녕하세요! 첫 방문이신가요?" earnedExp={20} onCancel={() => setModal(null)} onBtnClick={() => setModal(null)} />);
//  */
// export default function EXPModal({
//   type = "exp",
//   title,
//   desc,
//   earnedExp,
//   btnText = "닫기",
//   beforeExp,
//   maxExp,
//   isLevel = false,
//   onCancel,
//   onBtnClick,
//   beforeLevel,
//   currentLevel,
// }: Props) {
//   const {
//     nickname,
//     profile_emoji,
//     settings: { language },
//   } = useRecoilValue(UserState);

//   return (
//     <div css={Style}>
//       <div css={commentTitleStyle} className="headerContainer">
//         <div style={{ width: 16 }} />
//         <div className="profileContainer">
//           {isLevel ? (
//             <div className="profileTop">
//               <div className="profile">
//                 <div>{profile_emoji}</div>
//               </div>
//               <div className="level">
//                 <LevelText level={currentLevel} isLogin />
//               </div>
//             </div>
//           ) : (
//             <div className="title">
//               『 {title} 』{" "}
//               {earnedExp && isLevel ? (
//                 <>
//                   + {earnedExp} <span id="textExp">EXP</span>
//                 </>
//               ) : null}
//             </div>
//           )}
//         </div>
//         <div>
//           <Image
//             width={16}
//             height={16}
//             style={{ cursor: "pointer" }}
//             src="/icon/cancel.svg"
//             alt="cancel"
//             onClick={onCancel}
//           />
//         </div>
//       </div>

//       <div className="modalContent">
//         {type === "levelUp" ? (
//           <>
//             <div className="nickname">
//               <span id="nickname">{nickname}</span> 님
//             </div>
//             <div id="textUp">🎉 LEVEL UP 🎉</div>
//             <div className="nextLevel">
//               <LevelText level={beforeLevel} isLogin />
//               <Image width={31} height={8} src="/icon/ic_left_to_right_arrow.svg" alt="arrow" />
//               <LevelText level={currentLevel} isLogin />
//             </div>
//           </>
//         ) : type === "exp" ? (
//           <div id="textUp" style={{ marginTop: 10 }}>
//             {t["경험치 획득"][language]}
//           </div>
//         ) : null}
//         {isLevel ? (
//           <div className="title">
//             『 {title} 』{" "}
//             {earnedExp && isLevel ? (
//               <>
//                 + {earnedExp} <span id="textExp">EXP</span>
//               </>
//             ) : null}
//           </div>
//         ) : (
//           <div className="desc" style={{ marginTop: 12 }}>
//             {earnedExp && isLevel ? (
//               <>
//                 + {earnedExp} <span id="textExp">EXP</span>
//               </>
//             ) : null}
//           </div>
//         )}
//         {!isLevel && earnedExp ? (
//           <div style={{ marginTop: 12, textAlign: "center" }}>
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               <GainedXPBar prevXP={beforeExp} gainedXP={earnedExp} nextLevelXP={maxExp} />
//             </div>
//             <p
//               style={{ margin: 0, marginTop: 4 }}
//               css={css`
//                 color: #d2d2d5;
//                 font-size: 1rem;
//                 font-weight: 300;
//                 font-family:
//                   Spoqa Han Sans Neo,
//                   -apple-system,
//                   BlinkMacSystemFont,
//                   "Malgun Gothic",
//                   "맑은 고딕",
//                   helvetica,
//                   "Apple SD Gothic Neo",
//                   sans-serif;
//                 letter-spacing: -0.02em;
//               `}
//             >
//               EXP {beforeExp} (+{earnedExp}) / {maxExp}
//             </p>
//           </div>
//         ) : null}
//         {desc && (
//           <div className="textContent">
//             <div className="desc">{desc}</div>
//           </div>
//         )}

//         <button className="button-dark button-modal" onClick={onBtnClick}>
//           {btnText}
//         </button>
//       </div>
//     </div>
//   );
// }

// const Style = css`
//   width: 100vw;
//   max-width: 600px;
//   bottom: 0;
//   position: fixed;
//   background: #1c1c21;
//   transform: translateX(-50%);
//   border-radius: 10px 10px 0 0;
//   border-top: #272727 1px solid;
//   box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);
//   .headerContainer {
//     margin-top: 24px;
//     padding: 0 21px 8px 21px;
//     display: flex;
//     justify-content: space-between;
//   }
//   .profileContainer {
//     display: flex;
//     align-items: center;
//     flex-direction: column;
//     flex: 1;
//     height: 0;
//     .profileTop {
//       height: fit-content;
//       position: relative;
//       top: -60px;
//       .profile {
//         width: 60px;
//         height: 60px;

//         font-size: 46px;
//         line-height: normal;

//         outline: 4px #393939 solid;
//         border-radius: 100px;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         overflow: hidden;
//         background-color: rgb(32, 32, 44);
//         border: #272727 4px solid;
//         box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.4);

//         & > div {
//           position: relative;
//           top: ${isMobile ? "0px" : "-2px"};
//         }
//       }
//     }
//     .level {
//       display: flex;
//       justify-content: center;
//       height: 10px;
//       p {
//         position: relative;
//         top: -22px;
//       }
//     }
//   }
//   .modalContent {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     .nextLevel {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       text-align: center;
//       vertical-align: text-top;
//       margin-top: 2px;
//       p {
//         margin: 4px 0 0 0;
//       }
//     }
//   }
//   .button-modal {
//     margin-top: 24px;
//     background: #363d4e;
//     width: 90vw;
//     max-width: 500px;
//     margin-bottom: 20px;
//     border-radius: 4px;
//   }

//   .nickname {
//     color: #f7f7f7;
//     font-family:
//       Spoqa Han Sans Neo,
//       -apple-system,
//       BlinkMacSystemFont,
//       "Malgun Gothic",
//       "맑은 고딕",
//       helvetica,
//       "Apple SD Gothic Neo",
//       sans-serif;
//     font-size: 0.6rem;
//     font-style: normal;
//     font-weight: 300;
//     line-height: normal;
//     letter-spacing: -0.26px;
//     #nickname {
//       color: #e8e8ed;
//       text-align: center;
//       font-family:
//         Spoqa Han Sans Neo,
//         -apple-system,
//         BlinkMacSystemFont,
//         "Malgun Gothic",
//         "맑은 고딕",
//         helvetica,
//         "Apple SD Gothic Neo",
//         sans-serif;
//       font-size: 0.7692307692307693rem;
//       font-style: normal;
//       font-weight: 700;
//       line-height: normal;
//       letter-spacing: -0.28px;
//     }
//   }

//   #textUp {
//     color: #ead833;
//     text-align: center;
//     font-family:
//       Spoqa Han Sans Neo,
//       -apple-system,
//       BlinkMacSystemFont,
//       "Malgun Gothic",
//       "맑은 고딕",
//       helvetica,
//       "Apple SD Gothic Neo",
//       sans-serif;
//     font-size: 1.0769230769230769rem;
//     font-style: normal;
//     font-weight: 700;
//     line-height: normal;
//     letter-spacing: -0.28px;
//     margin-top: 12px;
//   }
//   .title {
//     color: #e8e8ed;
//     text-align: center;
//     font-family:
//       Spoqa Han Sans Neo,
//       -apple-system,
//       BlinkMacSystemFont,
//       "Malgun Gothic",
//       "맑은 고딕",
//       helvetica,
//       "Apple SD Gothic Neo",
//       sans-serif;
//     font-size: 1.1rem;
//     font-style: normal;
//     font-weight: 700;
//     line-height: normal;
//     letter-spacing: -0.28px;
//     margin-top: 10px;
//   }
//   #textExp {
//     color: #651fff;
//     font-family:
//       Spoqa Han Sans Neo,
//       -apple-system,
//       BlinkMacSystemFont,
//       "Malgun Gothic",
//       "맑은 고딕",
//       helvetica,
//       "Apple SD Gothic Neo",
//       sans-serif;
//     font-size: 0.7692307692307693rem;
//     font-style: normal;
//     font-weight: 700;
//     line-height: normal;
//     letter-spacing: -0.28px;
//     margin: 0;
//   }
//   .desc {
//     color: #f7f7f7;
//     text-align: center;
//     font-family:
//       Spoqa Han Sans Neo,
//       -apple-system,
//       BlinkMacSystemFont,
//       "Malgun Gothic",
//       "맑은 고딕",
//       helvetica,
//       "Apple SD Gothic Neo",
//       sans-serif;
//     font-size: 0.7692307692307693rem;
//     font-style: normal;
//     font-weight: 300;
//     line-height: normal;
//     letter-spacing: -0.28px;
//     white-space: pre;
//     text-align: center;
//   }

//   .textContent {
//     margin-top: 20px;
//     border: 2px solid #8e44ad;
//     border-radius: 10px;
//     padding: 10px 20px;
//   }
// `;

// function GainedXPBar({ prevXP, gainedXP, nextLevelXP }: { prevXP: number; gainedXP: number; nextLevelXP: number }) {
//   const prevPercentage = (prevXP / nextLevelXP) * 100;
//   const gainedPercentage = (gainedXP / nextLevelXP) * 100;
//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "200px",
//         height: "8px",
//         display: "flex",
//         background: "#3B3B3B",
//         borderRadius: 10,
//         border: "#737373 1px solid",
//       }}
//     >
//       <div
//         style={{
//           width: `${prevPercentage}%`,
//           height: "100%",
//           backgroundColor: "#99C8FF",
//         }}
//       ></div>
//       <div
//         style={{
//           width: `${gainedPercentage}%`,
//           height: "100%",
//           backgroundColor: "#4CAF50",
//           position: "absolute",
//           left: `${prevPercentage}%`,
//         }}
//       ></div>
//     </div>
//   );
// }
