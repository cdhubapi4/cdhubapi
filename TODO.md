# TODO

# 2025 년도 신간 계획
- 디스코드의 옛날 데이터 (이미지는 복원 못함 글만 복원 해서 넣어 두기)
   - seo 등록하기
- 다음카페, 네이버블로그, 옛날시코 처럼 쉬운 UI로 하기

- 트위터/이메일(인증) 로그인 적용
   - 이메일 인증은 firebase 또는 무료 api로 연동
- 게시글 (은밀한 사진/영상)은 맞팔만 보여줄 수 있도록 (비공개) or 나만보기 (완전비공개) or 모두에게 공개 3가지 옵션 제공, 그리고 외부 프로토콜로 업로드하기(본인이 직접 등록, 스레드 활용)
- 쪽지 지원, 실시간 개인 DM 지원, 단체 채팅방 지원(방 비밀번호 기능 가능)
- 트위터로 홍보하기
- 상단 쿠팡 배너 링크로 돈벌기

- 커뮤니티 트위터 연동 기록 강화
트위터 연동하면 내 기록 가져오는 버튼 넣기
트위터 글 작성하면 자동으로 내게 올라감(완전비공개/맞팔공개/공개 적용가능)

카테고리
자유게시판
이미지게시판
자기소개게시판
만남게시판
그룹채팅

- 프리미엄 서비스
   - 스토리지 저장
   - 유료 그룹 채팅방 운영(수익실현)



0. 우선
   홈(index.tsx)에서 회원가입일 경우 받아서 자동 새로고침 ON & 알림 ON 자동으로 로직타기.
   메인 화면, 확성기 불일치 확성기 답장할때랑 실제 확정기 뜰때랑

   쪽지 상세도 자동 refresh 추가하기

1. 기타 기능 추가

   1. 쪽지 쓸때 사진 첨부 URL 넣기 (https://image.kilho.net/ or https://photon.one/ 택 1)
   2. 프로필 이미지 지원 ( a.https://image.kilho.net/ or https://photon.one/ 택 1 )
   3. UI 개선
      c. 웹은 오른쪽에 붙이고 왼쪽은 앱 다운로드 사진 띄우기
      d. 스크롤 이동 남기기 -> ScrollProvider 활용
   4. 알림 관리 창 추가
      ㄴ 기기별로 체크박스 체크/해제 휴지통 -> 삭제 추가하기
   5. 커뮤니티 >>누르면 해당 쪽지로 이동
   6. 쪽지 쓰기 placecholder 문구 추가 : 유튜브 링크 입력 시 유튜브 플레이어로 변환됩니다. 예: https://www.youtube.com/watch?v=XjxOW5oKElc
      ㄴ 이미지링크도 파란색으로 됨 튜토리얼 추가
   7. a 태그 href # 으로 >>1 누르면 이동하게 바꾸기
   8. thread_index 링크 중 thread_url과 겹치는게 있으면 우리 껄로 url 바꾸기
      ㄴ thread_index 에 freethread.net 또는 ppomppu 주소 있으면 교체하기
      ㄴ left join thread_url u on u.url = extracted_url <-- url 이미 있는건 가져오지앖기
      ㄴ 쪽지 최소 10개 제한 풀기 //min-length 10
   9. 그룹채팅추가
      ㄴ 유저 초대 필요
   10. 카드 뒤집기 미니게임 추가 / 최초 100EXP
   11. 알깨기 미니게임 추가 / 클릭당 1EXP 최대 100EXP

2. 최적화

   1. SPA 개선
      ㄴ 속도 개선 https://pagespeed.web.dev/analysis/https-space-chat-io/7vvu8kmaii?hl=ko&form_factor=mobile
   2. 탈퇴한 유저 or 없는 유저 데이터 삭제 exp_log exp_data

3. 플랫폼 추가
   A. 데스크탑 (시스템 알림필수 -> 받을 때 출력)
   ㄴ 일렉트론 Node.js 로 함
   ㄴ 마이크로소프트 스토어 등록 (일렉트론)
   B. 앱 iOS / Android
   ㄴ 다운로드 / 복사 / 푸쉬알림 로그인/로그아웃/알림권한 거부 체크
   ㄴ iOS는 대부분 기능되면 추가하기(연간 회원비)
   C. Mac (FCM 백그라운드 필수)
   D. 웨어러블 (갤럭시와치, 아이폰와치 FCM 백그라운드 필수)
   E. 스팀(xbox 등) (FCM 백그라운드 필수)

4. 추천
   A. 관련 게시글 추천
   B. 검색결과없을 시 유사 태그 or 게시글 추천

5. 보안
   A. 웹일땐 REST API<->프론트 암호화/복호화해서 쓰기
   B. 토큰대신 쿠키쓰기, 웹일떈 쿠키에 저장하고, 세션스토리지쓰기, 앱일땐 로컬스토리지

6. 크롤링 추가
   A. 사이트 목록 -> https://brunch.co.kr/@joypinkgom/176
   [X] 스레딕 thredic.com
   [X] 프리스레드
   [X] 네이트판 일상
   ㄴ 인기TOP10말고 그외에 카테고리도 가져오기
   [X]. 뽐뿌ppomppu.co.kr 쇼핑
   [X] 네이버뉴스 - (댓글10개이상) https://media.naver.com/press/001
   S-1. 디씨
   S-2. 에펨코리아fmkorea.com 스포츠/종합커뮤니티
   S-3. 루리웹ruliweb.com 게임
   S-4. 클리앙clien.net 디지털/종합커뮤니티
   S-5. 더쿠 https://theqoo.net/hot?page=13
   ㄴ 1시간이내 댓글은 못 가져옴
   S-6. 웃긴대학humoruniv.com 유머
   S-7. 보배드림
   S-8. MLB파크mlbpark.donga.com 스포츠
   S-9. 해연갤hygall.com 연예
   S-10. SLR클럽
   S-11. 인스티즈 instiz.net/pt/4398628
   S-12. 이토렌트etoland.co.kr 종합커뮤니티
   S-13. 와이고수
   S-14. 인벤inven.co.kr 게임
   A-1. 기타 사이트 19sexnori36.me/archive꺼옮기기,te31.comall.naver3.net
   A-2. 일베
   A-3. 네이트썰 https://m.ssul.nate.com/
   A-4. 가생이닷컴gasengi.com 연예
   A-6. 블라인드
   A-7. 네이버 프리미엄 콘텐츠 https://contents.premium.naver.com/

7. 유니티 테스트
   1. 캐릭터 https://www.mixamo.com/#/
      ㄴ https://www.youtube.com/watch?v=oFBGs4_jJ0Y
      ㄴ mixamo.com - 동작 애니메이션이 많음
      ㄴ cgtrader.com - Riggded 로 선택 Top selling으로 체크하기도 -> textures.rar 다운 받고 obj 다운.
      ㄴ https://www.youtube.com/watch?v=oFBGs4_jJ0Y
   2. 움직임 제어https://itadventure.tistory.com/404
      ㄴ https://learnandcreate.tistory.com/1850
   3. 물 수제비 강화학습 로봇
   4. 걷기 학습 로봇
