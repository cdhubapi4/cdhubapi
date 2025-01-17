export const CountryNameToLanguage = (country: string) => {
  switch (country) {
    case "NONE":
      return "NONE";
    case "KR":
      return "KR";
    default:
      return "US";
  }
};
export type LanguageType = "KR" | "US" | "NONE";
export const t = {
  "쪽지 알림이 비활성화 상태입니다. [설정] 메뉴에서 활성화시킬 수 있습니다.": {
    KR: "쪽지 알림이 비활성화 상태입니다. [설정] 메뉴에서 활성화시킬 수 있습니다.",
    US: "Message notifications are disabled. You can enable them in the [Settings] menu.",
    NONE: "　",
  },
  "쪽지 새로고침이 비활성화 상태입니다. [설정] 메뉴에서 활성화시킬 수 있습니다.": {
    KR: "쪽지 새로고침이 비활성화 상태입니다. [설정] 메뉴에서 활성화시킬 수 있습니다.",
    US: "Message list refreshing is disabled. You can enable it in the [Settings] menu.",
    NONE: "　",
  },
  "5개의 쪽지를 보냈습니다": {
    KR: "5개의 쪽지를 보냈습니다",
    US: "Sent 5 messages",
    NONE: "　",
  },
  "한번 정한 성별은 영구적으로 바꿀 수 없습니다.": {
    KR: "한번 정한 성별은 영구적으로 바꿀 수 없습니다.",
    US: "Once a gender is chosen, it cannot be changed permanently.",
    NONE: "　",
  },
  "소개글을 입력해주세요.": {
    KR: "소개글을 입력해주세요.",
    US: "Please enter a bio.",
    NONE: "　",
  },
  "올바른 성별을 입력해주세요.": {
    KR: "올바른 성별을 입력해주세요.",
    US: "Invaild gender. (Please enter M or F)",
    NONE: "　",
  },
  "성별을 입력해주세요. (남성-M, 여성-F)": {
    KR: "성별을 입력해주세요. (남성-M, 여성-F)",
    US: "Enter your gender. (M or F)",
    NONE: "　",
  },
  "내가 차단한 유저가 없습니다.": {
    KR: "내가 차단한 유저가 없습니다.",
    US: "No Blocked Users",
    NONE: "　",
  },
  차단목록: {
    KR: "차단목록",
    US: "Block List",
    NONE: "　",
  },
  차단2: {
    KR: "차단",
    US: "Block",
    NONE: "　",
  },
  차단해제2: {
    KR: "차단해제",
    US: "Unblock",
    NONE: "　",
  },
  차단해제: {
    KR: "차단해제",
    US: "Unblock This User",
    NONE: "　",
  },
  차단하기: {
    KR: "차단하기",
    US: "Block This User",
    NONE: "　",
  },
  유저: {
    KR: "유저",
    US: "User",
    NONE: "　",
  },
  "팔로우 목록": {
    KR: "팔로우 목록",
    US: "Following List",
    NONE: "　",
  },
  "팔로잉 목록": {
    KR: "팔로잉 목록",
    US: "Followers List",
    NONE: "　",
  },
  "마지막 활동일": {
    KR: "마지막 활동일",
    US: "Last Activity Date",
    NONE: "　",
  },
  "좋아요한 글 보기": {
    KR: "좋아요한 글 보기",
    US: "Show Liked Letter List",
    NONE: "　",
  },
  "공유 쪽지 목록 보기": {
    KR: "공유 쪽지 목록 보기",
    US: "Show Share Letter List",
    NONE: "　",
  },
  DM보내기: {
    KR: "DM보내기",
    US: "Send DM",
    NONE: "　",
  },
  팔로우하기: {
    KR: "팔로우하기",
    US: "Follow",
    NONE: "　",
  },
  팔로우: {
    KR: "팔로우",
    US: "Follow",
    NONE: "　",
  },
  언팔로우: {
    KR: "언팔로우",
    US: "Unfollow",
    NONE: "　",
  },
  "쪽지내용을 입력해주세요": {
    KR: "쪽지내용을 입력해주세요",
    US: "Please enter the message content",
    NONE: "　",
  },
  "쪽지쓰기 바로가기": {
    KR: "쪽지쓰기 바로가기",
    US: "Go to Write",
    NONE: "　",
  },
  "회원가입 바로가기": {
    KR: "회원가입 바로가기",
    US: "Go to Settings for signup",
    NONE: "　",
  },
  "설정 바로가기": {
    KR: "설정 바로가기",
    US: "Go to Settings",
    NONE: "　",
  },
  //#region user-level-add-exp.ts
  visitFirst: {
    KR: `안녕하세요! 첫 방문이신가요? 
스페이스 챗은 랜덤 채팅과 인기 커뮤니티를 볼 수 있는 사이트에요.

쪽지 목록을 5초마다 자동새로고침 시켜주는 기능을
사용하려면 비밀번호 설정이 필요해요.

(우측 상단) 설정 → 회원가입 에서 비밀번호를 정하고
계정을 만들어보세요! `,
    US: `Hello! Is this your first visit? 
Space Chat is a platform where you can experience random chats and explore popular communities.

To use the feature that automatically refreshes the message list
every 5 seconds, you need to set a password.

Go to Settings (Top Right) → Sign Up to establish a password
and create your account!`,
    NONE: "　",
  },
  signUp: {
    KR: `환영합니다! 
경험치 포인트를 모아 레벨업을 해보세요!
우선 쪽지 쓰기부터 해볼까요?`,
    US: `Welcome! 
Collect experience points and level up!
How about starting with writing a message?`,
    NONE: "　",
  },
  writeLetterFirst: {
    KR: `🍡 매일 첫 쪽지는 경험치 포인트를 드려요!

쪽지 새로고침은 기본적으로 수동으로 클릭해야해요.
하지만 회원은 자동새로고침을 지원하니
이제 설정에서 쪽지 자동새로고침을 활성화해보세요!`,
    US: `🍡 Earn experience points for your first message every day!

Message refresh is manual by default.
But for members, automatic refresh is supported.
Now, try activating the automatic message refresh in settings!`,
    NONE: "　",
  },
  communityVisitFirst: {
    KR: `🎢 인기 게시물을 모아놓은 곳이에요! 
자신의 쪽지도 쪽지 상세의 메뉴버튼에서 공유할 수 있어요!`,
    US: `🎢 This is where popular posts are collected! 
You can also share your own messages from the message details menu button.`,
    NONE: "　",
  },
  dinoGameVisitFirst: {
    KR: `🥽 미니게임을 찾으셨군요 !`,
    US: `🥽 You've found the mini-game!`,
    NONE: "　",
  },
  megaphoneUseFirst: {
    KR: `📢 확성기는 24시간마다 초기화되요!`,
    US: `📢 The megaphone resets every 24 hours!`,
    NONE: "　",
  },
  megaphoneReplyFirst: {
    KR: `📢 확성기 답장은 무제한 무료 기능이에요!`,
    US: `📢 Replying with the megaphone is an unlimited free feature!`,
    NONE: "　",
  },
  messageDelete1First: {
    KR: `불필요한 쪽지는 삭제가 제격! 
쪽지 목록에서도 길게 누르고 있으면 삭제가 가능해요!`,
    US: `Deleting unnecessary messages is the way to go! 
You can also delete by pressing and holding in the message list.`,
    NONE: "　",
  },
  messageDelete2First: {
    KR: `쪽지 목록에서도 삭제가 가능하다는 걸 아셨군요! 
다시 길게 누르고 있으면 복원도 가능해요!
(단, 새로고침시 사라져요! - 자동 새로고침 포함)`,
    US: `You've noticed that you can delete from the message list! 
Press and hold again to restore.
(Note: It disappears upon refreshing! - including auto-refresh)`,
    NONE: "　",
  },
  messageRestoreFirst: {
    KR: `처음으로 쪽지를 복원하셨군요!`,
    US: `You've restored a message for the first time!`,
    NONE: "　",
  },
  autoRefreshUseFirst: {
    KR: `쪽지 자동 새로고침은 5초마다 새 쪽지를 갱신해요!`,
    US: `Message auto-refresh updates new messages every 5 seconds!`,
    NONE: "　",
  },
  allowNotiFirst: {
    KR: `알림을 통해 기기별로 알림 설정이 가능해요! 웹/앱 모두 지원해요!`,
    US: `Through notifications, you can set alerts for each device! Both web and app are supported.`,
    NONE: "　",
  },
  //#endregion

  "경험치 획득": {
    KR: "경험치 획득",
    US: "EXP Gained",
    NONE: "　",
  },
  "필터:전체": {
    KR: "전체",
    US: "All",
    NONE: "　",
  },
  "필터:제목": {
    KR: "제목",
    US: "Title",
    NONE: "　",
  },
  "필터:쪽지내용": {
    KR: "쪽지내용",
    US: "Content",
    NONE: "　",
  },
  "필터:태그": {
    KR: "태그",
    US: "Tag",
    NONE: "　",
  },
  "필터:유저": {
    KR: "닉네임",
    US: "Nickname",
    NONE: "　",
  },
  "검색어를 입력해주세요": {
    KR: "검색어를 입력해주세요",
    US: "Please enter a search term",
    NONE: "　",
  },

  "전체 목록": {
    KR: "전체 목록",
    US: "go to List",
    NONE: "　",
  },
  "즐겨찾기 내역이 없습니다": {
    KR: "즐겨찾기 내역이 없습니다",
    US: "No bookmark history",
    NONE: "　",
  },
  "좋아요 내역이 없습니다": {
    KR: "좋아요 내역이 없습니다",
    US: "No like history",
    NONE: "　",
  },
  "싫어요 내역이 없습니다": {
    KR: "싫어요 내역이 없습니다",
    US: "No dislike history",
    NONE: "　",
  },
  "내가 팔로우한 유저가 없습니다": {
    KR: "내가 팔로우한 유저가 없습니다",
    US: "You are not following any users.",
    NONE: "　",
  },
  "나를 팔로우한 유저가 없습니다": {
    KR: "나를 팔로우한 유저가 없습니다",
    US: "No users are following you.",
    NONE: "　",
  },
  "즐겨찾기 목록": {
    KR: "즐겨찾기 목록",
    US: "Bookmark List",
    NONE: "　",
  },
  "좋아요 목록": {
    KR: "좋아요 목록",
    US: "Like List",
    NONE: "　",
  },
  "싫어요 목록": {
    KR: "싫어요 목록",
    US: "Dislike List",
    NONE: "　",
  },
  "전체 쪽지": {
    KR: "전체 쪽지",
    US: "All Messages",
    NONE: "　",
  },
  "필터: 전체": {
    KR: "필터: 전체",
    US: "Filter: All",
    NONE: "　",
  },
  "필터: 오늘": {
    KR: "필터: 오늘",
    US: "Filter: Today",
    NONE: "　",
  },
  "필터: 이번주": {
    KR: "필터: 이번주",
    US: "Filter: This Week",
    NONE: "　",
  },
  "필터: 이번달": {
    KR: "필터: 이번달",
    US: "Filter: This Month",
    NONE: "　",
  },
  "필터: 올해": {
    KR: "필터: 올해",
    US: "Filter: This Year",
    NONE: "　",
  },
  "정렬: 최근 생성순": {
    KR: "정렬: 최근 생성순",
    US: "Sort: Recently Created",
    NONE: "　",
  },
  "정렬: 최근 갱신순": {
    KR: "정렬: 최근 갱신순",
    US: "Sort: Recently Updated",
    NONE: "　",
  },
  "정렬: 좋아요 많은순": {
    KR: "정렬: 좋아요 많은순",
    US: "Sort: Most Likes",
    NONE: "　",
  },
  "정렬: 싫어요 많은순": {
    KR: "정렬: 싫어요 많은순",
    US: "Sort: Most Dislikes",
    NONE: "　",
  },
  "정렬: 댓글 많은순": {
    KR: "정렬: 댓글 많은순",
    US: "Sort: Most Comments",
    NONE: "　",
  },

  "정렬: 조회수 많은순": {
    KR: "정렬: 조회수 많은순",
    US: "Sort: Most Views",
    NONE: "　",
  },
  "정렬: 정확도 순": {
    KR: "정렬: 정확도 순",
    US: "Sort: Relevance",
    NONE: "　",
  },
  "10개씩 보기": {
    KR: "10개씩 보기",
    US: "View 10 items",
    NONE: "　",
  },
  "15개씩 보기": {
    KR: "15개씩 보기",
    US: "View 15 items",
    NONE: "　",
  },
  "20개씩 보기": {
    KR: "20개씩 보기",
    US: "View 20 items",
    NONE: "　",
  },
  처음: {
    KR: "처음",
    US: "First",
    NONE: "　",
  },
  "이전 페이지": {
    KR: "이전",
    US: "Previous",
    NONE: "　",
  },

  다음: {
    KR: "다음",
    US: "Next",
    NONE: "　",
  },
  마지막: {
    KR: "마지막",
    US: "Last",
    NONE: "　",
  },
  "마지막 쪽지 공유 이후 추가된 쪽지들이 갱신됩니다.": {
    KR: "마지막 쪽지 공유 이후 추가된 쪽지들이 갱신됩니다.",
    US: "Messages added after the last note sharing will be updated.",
    NONE: "　",
  },
  "↺ 쪽지 리스트 갱신하기": {
    KR: "↺ 쪽지 리스트 갱신하기",
    US: "↺ Refresh Message List",
    NONE: "　",
  },
  "(선택) 기존 그대로 유지": {
    KR: "(선택) 기존 그대로 유지",
    US: "(Optional) Keep as default",
    NONE: "　",
  },
  "쪽지 내용 다운로드가 완료되었습니다": {
    KR: "쪽지 내용 다운로드가 완료되었습니다",
    US: "Note content downloaded successfully",
    NONE: "　",
  },
  "쪽지 내용 복사가 완료되었습니다": {
    KR: "쪽지 내용 복사가 완료되었습니다",
    US: "Entire note content copied successfully",
    NONE: "　",
  },
  "링크 복사가 완료되었습니다": {
    KR: "링크 복사가 완료되었습니다",
    US: " ",
    NONE: "　",
  },
  "정말로 커뮤니티에서 삭제하시겠습니까?": {
    KR: "정말로 커뮤니티에서 삭제하시겠습니까?",
    US: "Do you really want to delete from the community?",
    NONE: "　",
  },
  "🔧 수정하기": {
    KR: "🔧 수정하기",
    US: "🔧 Edit",
    NONE: "　",
  },
  "💣 커뮤니티에서 삭제하기": {
    KR: "💣 커뮤니티에서 삭제하기",
    US: "💣 Delete from Community",
    NONE: "　",
  },
  "💾 전체 쪽지 내용 다운로드": {
    KR: "💾 전체 쪽지 내용 다운로드",
    US: "💾 Download all note content",
    NONE: "　",
  },
  "🧾 전체 쪽지 내용 복사하기": {
    KR: "🧾 전체 쪽지 내용 복사하기",
    US: "🧾 Copy Note Content",
    NONE: "　",
  },
  "🔗 링크 공유하기": {
    KR: "🔗 링크 공유하기",
    US: "🔗 Share Link",
    NONE: "　",
  },
  "📤 커뮤니티로 내보내기": {
    KR: "📤 커뮤니티로 내보내기",
    US: "📤 Export to Community",
    NONE: "　",
  },
  "📧 신고하기": {
    KR: "📧 신고하기",
    US: "📧 Report",
    NONE: "　",
  },
  댓글: {
    KR: "댓글",
    US: "Comments",
    NONE: "　",
  },
  "정말로 댓글을 삭제하시겠습니까?": {
    KR: "정말로 댓글을 삭제하시겠습니까?",
    US: "Are you sure you want to delete this comment?",
    NONE: "　",
  },
  "(삭제됨)": {
    KR: "(삭제됨)",
    US: "(Deleted)",
    NONE: "　",
  },
  "수정할 댓글 내용": {
    KR: "수정할 댓글 내용",
    US: "Comment to Edit",
    NONE: "　",
  },
  "댓글 수정하기": {
    KR: "댓글 수정하기",
    US: "Submit",
    NONE: "　",
  },
  수정: {
    KR: "수정",
    US: "Edit",
    NONE: "　",
  },
  "댓글 내용을 입력해주세요": {
    KR: "댓글 내용을 입력해주세요",
    US: "Please enter the comment",
    NONE: "　",
  },
  "댓글 달기": {
    KR: "댓글 달기",
    US: "Submit",
    NONE: "　",
  },
  "댓글 내용": {
    KR: "댓글 내용",
    US: "Comment",
    NONE: "　",
  },
  접기: {
    KR: "접기",
    US: "Hide",
    NONE: "　",
  },
  "자세히 보기": {
    KR: "자세히 보기",
    US: "More",
    NONE: "　",
  },
  좋아요: {
    KR: "좋아요",
    US: "Like",
    NONE: "　",
  },
  싫어요: {
    KR: "싫어요",
    US: "Dislike",
    NONE: "　",
  },
  대댓글달기: {
    KR: "대댓글달기",
    US: "Reply",
    NONE: "　",
  },
  "자주보는 태그가 없습니다.": {
    KR: "자주보는 태그가 없습니다.",
    US: "There are no frequently viewed tags.",
    NONE: "　",
  },
  "주요 태그 TOP 10": {
    KR: "주요 태그 TOP 10",
    US: "Main Tags TOP 10",
    NONE: "　",
  },
  "전체 태그": {
    KR: "전체 태그",
    US: "All Tags",
    NONE: "　",
  },
  "쪽지 많은순": {
    KR: "쪽지 많은순",
    US: "Tags with Most Letters",
    NONE: "　",
  },
  글자순: {
    KR: "글자순",
    US: "Alphabetical",
    NONE: "　",
  },
  "최근 생긴 태그순": {
    KR: "최근 생긴 태그순",
    US: "Recently Created Tags",
    NONE: "　",
  },
  랜덤: {
    KR: "랜덤",
    US: "Random",
    NONE: "　",
  },
  "자주보는 태그": {
    KR: "자주보는 태그",
    US: "Frequently Viewed Tags",
    NONE: "　",
  },
  "최근 본 쪽지가 없습니다.": {
    KR: "최근 본 쪽지가 없습니다.",
    US: "There are no recently viewed letters.",
    NONE: "　",
  },
  "최근 본 쪽지": {
    KR: "최근 본 쪽지",
    US: "Viewed Letters",
    NONE: "　",
  },
  "최근 새 쪽지": {
    KR: "최근 새 쪽지",
    US: "New Letters",
    NONE: "　",
  },
  전체보기: {
    KR: "전체보기",
    US: "View All",
    NONE: "　",
  },
  "HOT 쪽지 TOP 5": {
    KR: "HOT 쪽지 TOP 5",
    US: "HOT Letter TOP 5",
    NONE: "　",
  },
  완료: {
    KR: "완료",
    US: "Submit",
    NONE: "　",
  },
  "쪽지의 제목을 입력해주세요": {
    KR: "쪽지의 제목을 입력해주세요",
    US: "Please enter the title of the letter",
    NONE: "　",
  },
  "메인 쪽지 번호를 입력해주세요": {
    KR: "메인 쪽지 번호를 입력해주세요",
    US: "Please enter the order of the main letter",
    NONE: "　",
  },
  "태그를 최소 1개 입력해주세요": {
    KR: "태그를 최소 1개 입력해주세요",
    US: "Please enter at least 1 tag",
    NONE: "　",
  },
  "없는 쪽지 번호입니다.": {
    KR: "없는 쪽지 번호입니다.",
    US: "It's the order of letters that don't exist.",
    NONE: "　",
  },

  "태그는 최대 3개까지만 선택할 수 있습니다.": {
    KR: "태그는 최대 3개까지만 선택할 수 있습니다.",
    US: "You can select up to three tags.",
    NONE: "　",
  },
  "태그를 1개 선택해주세요. (콤마로 구분, 최대 3개)": {
    KR: "태그를 1개 선택해주세요. (콤마로 구분, 최대 3개)",
    US: "Please select one tag. (Separated by commas, up to 3)",
    NONE: "　",
  },
  태그: {
    KR: "태그",
    US: "Tag",
    NONE: "　",
  },
  "중심이 되는 쪽지 번호를 입력해주세요.": {
    KR: "중심이 되는 쪽지 번호를 입력해주세요.",
    US: "Please enter the main letter order.",
    NONE: "　",
  },
  "메인 쪽지 번호": {
    KR: "메인 쪽지 번호",
    US: "Major Letter Order Number",
    NONE: "　",
  },
  "쪽지의 제목을 입력해주세요.": {
    KR: "쪽지의 제목을 입력해주세요.",
    US: "Please enter the title of the letter.",
    NONE: "　",
  },
  제목: {
    KR: "제목",
    US: "Title",
    NONE: "　",
  },
  이야기: {
    KR: "이야기",
    US: "Story",
    NONE: "　",
  },
  "커뮤니티로 내보내기 위해서는 최소 5개의 쪽지가 존재해야합니다.": {
    KR: "커뮤니티로 내보내기 위해서는 최소 5개의 쪽지가 존재해야합니다.",
    US: "You need at least 5 messages to export to the community.",
    NONE: "　",
  },
  님의: {
    KR: "님의",
    US: "'s",
    NONE: "　",
  },
  신고: {
    KR: "신고",
    US: "Report this letter",
    NONE: "　",
  },
  "💣 쪽지 삭제": {
    KR: "💣 쪽지 삭제",
    US: "💣 Delete this letter",
    NONE: "　",
  },
  전체: {
    KR: "전체",
    US: "List",
    NONE: "　",
  },
  이전: {
    KR: "이전",
    US: "Back",
    NONE: "　",
  },
  "정말로 쪽지를 삭제하시겠습니까?": {
    KR: "정말로 쪽지를 삭제하시겠습니까?",
    US: "Are you sure you want to delete the letter?",
    NONE: "　",
  },
  "잘못 입력하셨습니다. '삭제'를 입력해주세요.": {
    KR: "잘못 입력하셨습니다. '삭제'를 입력해주세요.",
    US: "You have entered the wrong one. Please enter 'DELETE'.",
    NONE: "　",
  },
  "닉네임이 일치하지 않습니다.": {
    KR: "닉네임이 일치하지 않습니다.",
    US: "The nickname you entered does not match.",
    NONE: "　",
  },
  "회원탈퇴를 진행하려면 닉네임을 입력해주세요": {
    KR: "회원탈퇴를 진행하려면 닉네임을 입력해주세요",
    US: "Please enter your nickname to proceed with membership withdrawal",
    NONE: "　",
  },
  회원탈퇴: {
    KR: "회원탈퇴",
    US: "Delete My Account",
    NONE: "　",
  },
  국가: {
    KR: "국가",
    US: "country",
    NONE: "　",
  },
  "글이 존재하지 않거나 삭제되었습니다.": {
    KR: "글이 존재하지 않거나 삭제되었습니다.",
    US: "The article does not exist or has been deleted.",
    NONE: "　",
  },
  "내가 쓴 확성기에 답장할 수 없습니다.": {
    KR: "내가 쓴 확성기에 답장할 수 없습니다.",
    US: "I can't reply to the megaphone I wrote.",
    NONE: "　",
  },
  "📮 답장하기": {
    KR: "📮 답장하기",
    US: "📮 Reply",
    NONE: "　",
  },
  "네트워크에 문제가 생겼습니다.": {
    KR: "네트워크에 문제가 생겼습니다.",
    US: "Network Error",
    NONE: "　",
  },
  "⚙️ 설정 바로가기": {
    KR: "⚙️ 설정 바로가기",
    US: "⚙️ Go to settings",
    NONE: "　",
  },
  "마지막 쪽지에요. 쪽지는 한 스레드에 300개까지 제한이 있어요.": {
    KR: "마지막 쪽지에요. 쪽지는 한 스레드에 300개까지 제한이 있어요.",
    US: "This is the last message. There's a limit of 300 messages per thread.",
    NONE: "　",
  },
  "쪽지가 300개로 꽉 찼습니다. 더 이상 답장을 주고받을 수 없어요.": {
    KR: "쪽지가 300개로 꽉 찼습니다. 더 이상 답장을 주고받을 수 없어요.",
    US: "You have reached the limit of 300 messages.",
    NONE: "　",
  },
  "이미 답장을 보낸 쪽지입니다.": {
    KR: "이미 답장을 보낸 쪽지입니다.",
    US: "You've already replied to.",
    NONE: "　",
  },
  "쪽지의 내용을 입력해주세요.": {
    KR: "쪽지의 내용을 입력해주세요.",
    US: "Please enter the contents of the note.",
    NONE: "　",
  },
  닫기: {
    KR: "닫기",
    US: "close",
    NONE: "　",
  },
  "확성기 사용 내역이 없습니다": {
    KR: "확성기 사용 내역이 없습니다",
    US: "There is no history",
    NONE: "　",
  },
  "🔥 확성기 사용하기": {
    KR: "🔥 확성기 사용하기",
    US: "🔥 Use Megaphone",
    NONE: "　",
  },
  "\n\n이 곳에 확성기로 보낼 내용을 입력해주세요.\n\n- 불법/욕설/비방은 언제든지 삭제될 수 있습니다.\n- 이벤트 확성기는 24시간 동안만 유지됩니다.":
    {
      KR: "\n\n이 곳에 확성기로 보낼 내용을 입력해주세요.\n\n- 불법/욕설/비방은 언제든지 삭제될 수 있습니다.\n- 이벤트 확성기는 24시간 동안만 유지됩니다.",
      US: "\n\nPlease enter what you want to send to the megaphone here.\n\n- Illegal or cursive can be deleted at any time.\n- Event megaphone only last for 1 hour.",
      NONE: "　",
    },
  "에 다시 확성기 사용하기를 눌러주세요.": {
    KR: "에 다시 확성기 사용하기를 눌러주세요.",
    US: " at time!",
    NONE: "　",
  },
  "선착순 1명이 끝났습니다. ": {
    KR: "선착순 1명이 끝났습니다. ",
    US: "One person on a first-come, first-served basis has already used a megaphone. Send it back in ",
    NONE: "　",
  },
  "쪽지 보내기": {
    KR: "쪽지 보내기",
    US: "Send",
    NONE: "　",
  },
  설정: {
    KR: "설정",
    US: "⚙️",
    NONE: "　",
  },
  "새 메세지가 도착했습니다.": {
    KR: "새 메세지가 도착했습니다.",
    US: "A new message has arrived.",
    NONE: "　",
  },
  "새 쪽지 알림": {
    KR: "새 쪽지 알림",
    US: "New Message Notification",
    NONE: "　",
  },
  "🪐새 쪽지 알림 허용이 해제되었습니다": {
    KR: "🪐새 쪽지 알림 허용이 해제되었습니다",
    US: "🪐Permission for new message notifications has been revoked.",
    NONE: "　",
  },
  "🪐사이트 알림이 차단되었거나 지원하지 않는 브라우저입니다.": {
    KR: "🪐사이트 알림이 차단되었거나 지원하지 않는 브라우저입니다.",
    US: "🪐Permission for new message notifications has been denied.",
    NONE: "　",
  },
  "🪐새 쪽지 알림이 허용되었습니다": {
    KR: "🪐새 쪽지 알림이 허용되었습니다",
    US: "🪐Permission for new message notifications has been granted.",
    NONE: "　",
  },
  "알림을 지원하지 않는 브라우저입니다.": {
    KR: "알림을 지원하지 않는 브라우저입니다.",
    US: "This browser does not support notifications.",
    NONE: "　",
  },
  "모바일은 지원되지 않는 기능입니다.": {
    KR: "모바일은 지원되지 않는 기능입니다.",
    US: "This feature is not supported on mobile.",
    NONE: "　",
  },
  "로그인/회원가입이 필요한 기능입니다.": {
    KR: "로그인/회원가입이 필요한 기능입니다.",
    US: "This function requires signin or signup.",
    NONE: "　",
  },
  "[무료 이벤트] 24시간마다 벌어지는 무료 확성기 이벤트!\n선착순 1명 확성기를 무료로 사용해보세요!\n\n[사용법]\n설정 -> 확성기 사용하기를 눌러주세요.":
    {
      KR: "[무료 이벤트] 24시간마다 벌어지는 무료 확성기 이벤트!\n선착순 1명 확성기를 무료로 사용해보세요!\n\n[사용법]\n설정 -> 확성기 사용하기를 눌러주세요.",
      US: "[Event] Free loudspeaker event every hour!\nFirst-come-first-served megaphones for free! Click \n[Usage]\nSettings -> Use a megaphone.",
      NONE: "　",
    },
  "뒤로\n가기": {
    KR: "뒤로\n가기",
    US: "◀",
    NONE: "　",
  },
  "변경할 언어를 설정해주세요": {
    KR: "Please set the language you want to change (enter: US or KR)",
    US: "Please set the language you want to change (enter: US or KR)",
    NONE: "　",
  },
  "언어 변경은 'US' 또는 'KR'만 가능합니다.": {
    KR: "Language can only be changed to 'US' or 'KR'",
    US: "Language can only be changed to 'US' or 'KR'",
    NONE: "　",
  },
  "언어 설정": {
    KR: "Change Language",
    US: "Change Language",
    NONE: "　",
  },
  "앱 버전": {
    KR: "앱 버전",
    US: "Version",
    NONE: "　",
  },
  "계정 생성일": {
    KR: "계정 생성일",
    US: "Account Created on",
    NONE: "　",
  },
  "확성기 사용하기": {
    KR: "확성기 사용하기",
    US: "Use a megaphone",
    NONE: "　",
  },
  "확성기 사용내역": {
    KR: "확성기 사용내역",
    US: "Show my megaphone list",
    NONE: "　",
  },
  "폰트 크기가 형식에 맞지 않습니다. 10과 20사이의 숫자만 입력해주세요.": {
    KR: "폰트 크기가 형식에 맞지 않습니다. 10과 20사이의 숫자만 입력해주세요.",
    US: "The font size format is incorrect. Please enter a number between 10 and 20.",
    NONE: "　",
  },
  "원하는 폰트 수정 크기를 입력해주세요. 숫자(10 - 20)": {
    KR: "원하는 폰트 수정 크기를 입력해주세요. 숫자(10 - 20)",
    US: "Please enter the desired font size. Number (10 - 20)",
    NONE: "　",
  },
  "폰트크기 수정": {
    KR: "폰트크기 수정",
    US: "Adjust Font Size",
    NONE: "　",
  },
  문의하기: {
    KR: "문의하기",
    US: "Ask the admin by e-mail",
    NONE: "　",
  },
  "크롬 공룡 게임하기": {
    KR: "크롬 공룡 게임하기",
    US: "Play Chrome Dinosaur Game",
    NONE: "　",
  },
  "모든 대화내역 삭제": {
    KR: "모든 대화내역 삭제",
    US: "Delete all chat history",
    NONE: "　",
  },
  "새 쪽지 받지 않기": {
    KR: "새 쪽지 받지 않기",
    US: "Don't take new messages",
    NONE: "　",
  },
  "답장 보낸 쪽지도 보기": {
    KR: "답장 보낸 쪽지도 보기",
    US: "View the message you replied to",
    NONE: "　",
  },
  "자동 새로고침 활성화 (5초)": {
    KR: "자동 새로고침 활성화 (5초)",
    US: "Enable automatic refresh (5 seconds)",
    NONE: "　",
  },
  로그인: {
    KR: "로그인",
    US: "Sign in",
    NONE: "　",
  },
  로그아웃: {
    KR: "로그아웃",
    US: "Sign out",
    NONE: "　",
  },
  "비밀번호 변경": {
    KR: "비밀번호 변경",
    US: "Change password",
    NONE: "　",
  },
  회원가입: {
    KR: "회원가입",
    US: "Sign up",
    NONE: "　",
  },
  "프로필 이모지 변경": {
    KR: "프로필 이모지 변경",
    US: "Change profile emoji",
    NONE: "　",
  },
  "성별 정하기": {
    KR: "성별 정하기",
    US: "Choose Gender",
    NONE: "　",
  },
  "소개글 쓰기": {
    KR: "소개글 쓰기",
    US: "Write a bio",
    NONE: "　",
  },
  "소개글 변경": {
    KR: "소개글 변경",
    US: "Change bio",
    NONE: "　",
  },
  "닉네임 변경": {
    KR: "닉네임 변경",
    US: "Change Nickname",
    NONE: "　",
  },
  닉네임: {
    KR: "닉네임",
    US: "nickname",
    NONE: "　",
  },
  성별: {
    KR: "성별",
    US: "Gender",
    NONE: "　",
  },
  소개글: {
    KR: "소개글",
    US: "Bio",
    NONE: "　",
  },
  "쪽지 목록": {
    KR: "쪽지 목록",
    US: "Chat List",
    NONE: "　",
  },
  "쪽지 쓰기": {
    KR: "쪽지 쓰기",
    US: "New Chat",
    NONE: "　",
  },
  새로고침: {
    KR: "새로고침",
    US: "Refresh",
    NONE: "　",
  },
  "모든 채팅 내역을 삭제하려면 '삭제'를 입력해주세요": {
    KR: "모든 채팅 내역을 삭제하려면 '삭제'를 입력해주세요",
    US: "Please enter 'DELETE' to delete all chat history",
    NONE: "　",
  },
  삭제: {
    KR: "삭제",
    US: "DELETE",
    NONE: "　",
  },
  "네트워크 오류가 발생했습니다.": {
    KR: "네트워크 오류가 발생했습니다.",
    US: "A network error has occurred.",
    NONE: "　",
  },
  "로그아웃시 닉네임과 비밀번호를 알아야 재로그인이 가능합니다.\n로그아웃 하시겠습니까?": {
    KR: "로그아웃시 닉네임과 비밀번호를 알아야 재로그인이 가능합니다.\n로그아웃 하시겠습니까?",
    US: "When you logout, you need to know your nickname and password to log in again.\nAre you sure you want to log out?",
    NONE: "　",
  },
  "계정을 찾을 수 없습니다.": {
    KR: "계정을 찾을 수 없습니다.",
    US: "Account not found.",
    NONE: "　",
  },
  "사용할 닉네임(아이디)을 입력해주세요. (최대 30자)": {
    KR: "사용할 닉네임(아이디)을 입력해주세요. (최대 30자)",
    US: "Please enter the nickname (ID) you want to use. (up to 30 characters)",
    NONE: "　",
  },
  "어떤 닉네임으로 변경할까요? (최대 30자)": {
    KR: "어떤 닉네임으로 변경할까요? (최대 30자)",
    US: "What nickname should I change to? (up to 30 characters)",
    NONE: "　",
  },
  "닉네임은 30자 이하여야 합니다.": {
    KR: "닉네임은 30자 이하여야 합니다.",
    US: "The nickname must be no more than 30 characters.",
    NONE: "　",
  },
  "새 닉네임은 30자 이하여야 합니다.": {
    KR: "새 닉네임은 30자 이하여야 합니다.",
    US: "The new nickname must be no more than 30 characters.",
    NONE: "　",
  },
  "새 닉네임에는 'Anonymous'를 포함할 수 없습니다.": {
    KR: "새 닉네임에는 'Anonymous'를 포함할 수 없습니다.",
    US: "The new nickname cannot contain 'Anonymous'.",
    NONE: "　",
  },
  "이미 사용중인 닉네임입니다.": {
    KR: "이미 사용중인 닉네임입니다.",
    US: "The nickname is already in use.",
    NONE: "　",
  },
  "어떤 프로필(이모지)으로 변경할까요? (예:": {
    KR: "어떤 프로필(이모지)으로 변경할까요? (예:",
    US: "Which profile (emoji) should I change to? (e.g ",
    NONE: "　",
  },
  "새 이모지는 1개만 가능합니다.": {
    KR: "새 이모지는 1개만 가능합니다.",
    US: "Only one new emoji is available.",
    NONE: "　",
  },
  "사용할 비밀번호를 설정해주세요 (최소 4자)": {
    KR: "사용할 비밀번호를 설정해주세요 (최소 4자)",
    US: "Please set the password you want to use (Minimum of 4 characters)",
    NONE: "　",
  },
  "비밀번호는 최소 4자입니다.": {
    KR: "비밀번호는 최소 4자입니다.",
    US: "The password is at least 4 characters long.",
    NONE: "　",
  },
  "다시한번 비밀번호를 입력해주세요": {
    KR: "다시한번 비밀번호를 입력해주세요",
    US: "Please enter your password again",
    NONE: "　",
  },
  "비밀번호가 다릅니다. 다시 입력해주세요.": {
    KR: "비밀번호가 다릅니다. 다시 입력해주세요.",
    US: "The password is different. Please re-enter.",
    NONE: "　",
  },
  "닉네임을 입력해주세요": {
    KR: "닉네임을 입력해주세요",
    US: "Please enter your nickname",
    NONE: "　",
  },
  "비밀번호를 입력해주세요": {
    KR: "비밀번호를 입력해주세요",
    US: "Please enter your password",
    NONE: "　",
  },
  "해당 계정이 없습니다. 다시 시도해주세요.": {
    KR: "해당 계정이 없습니다. 다시 시도해주세요.",
    US: "The account does not exist. Please try again.",
    NONE: "　",
  },
  "여기에 문의 내용을 입력해주세요.": {
    KR: "여기에 문의 내용을 입력해주세요.",
    US: "Please enter your inquiry here.",
    NONE: "　",
  },
};
