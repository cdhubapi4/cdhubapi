#!/bin/bash
# 크롬 개발자 도구 네이버 SEO 반복 등록용
#  select concat("\"https://space-chat.io/archive?id=",thread_id  * 183,"\"")
# from thread_public tp
# order by thread_id  desc limit 50

# 공통 변수
site="https://space-chat.io"
user_enc_id="782acf97ad2ef78473550e773b0cc8b8a3538f28a977c3fddd498b9dee6fa5d0"
_csrf="LBDkQqpi-Buj3ptTXW90dAAipjjPSSfTU-eQ"
cookie="SADV=s%3AdzlN2e8DliFcXNEDUShHfaO_1bMOvC-D.sqePH09dx6%2B9Gii9MpLaadyF%2Bwudz4gPG8XkxgYnuzs; NNB=KSWJIO375FZWK; nid_inf=930422342; NID_AUT=oNSsO3h7XXoSRQURS9ULfak3tyeDkRDYtu/NCo9WmKvjX/YX8DyQiAnJGCQP0axX; NID_SES=AAABha/dp73UbnPKb3kOuPFk8LZPXROAuIugUWdg5zxIWR1vNwpWNOGTkcfOi9XDk7FfFQJLsTVI+rs+nNPsJXGTGXk0GBXy6C/zcH6qMcv5ByCegUEG/fi0e4bd/BFF7lQGBmyHC5UgDBovayMN3cYMunj2y9PyZjq4UKcCTtyu6LdNtkhQ+VTgcbpAi0gVz4EZEXhFFG7mncbeaM6x7LA359XukUO5ebUI3sSYIjJRQRumvGVOT/rrzc4eK6IcxposUgk8htamRmb3s2ZG7hCJRvZr9R0qM2ZGC3N38adhJWNDpZajJazyRfNlBwpWLcg5YbCU8VucdmZHRciQh4+LNUORWy0j6panusaJVCx/AdXjMeWEJ2Wp2cgNcESepVDysNxR4HuM1jMBlnLWpn8arL5Q4qCVIEh9ghhii3Jv3ssjV6SXZjLdDeDd1AvHPuT95+15zOgBEm/xLa8hH5i9V0HqsS6C1i1yVpby0WudRfXk6i57PkoFRTf+Isqg5eSi4IQxHcdlD3xvkN1+5M0uTX8=; NID_JKL=QbWwLStwAETdI5cM6IAP8TiliAelInd+4CeuK6sTP+8="

# test https://space-chat.io/archive?id=38754642
# 문서 ID 목록
declare -a list=(
"archive?id=38898114"
"archive?id=38897931"
"archive?id=38897748"
"archive?id=38897565"
"archive?id=38897382"
"archive?id=38897199"
"archive?id=38897016"
"archive?id=38896833"
"archive?id=38896650"
"archive?id=38896467"
"archive?id=38896284"
"archive?id=38896101"
"archive?id=38895918"
"archive?id=38895735"
"archive?id=38895552"
"archive?id=38895369"
"archive?id=38895186"
"archive?id=38895003"
"archive?id=38894820"
"archive?id=38894637"
"archive?id=38894454"
"archive?id=38894271"
"archive?id=38894088"
"archive?id=38893905"
"archive?id=38893722"
"archive?id=38893539"
"archive?id=38893356"
"archive?id=38893173"
"archive?id=38892990"
"archive?id=38892807"
"archive?id=38892624"
"archive?id=38892441"
"archive?id=38892258"
"archive?id=38892075"
"archive?id=38891892"
"archive?id=38891709"
"archive?id=38891526"
"archive?id=38891343"
"archive?id=38891160"
"archive?id=38890977"
"archive?id=38890794"
"archive?id=38890611"
"archive?id=38890428"
"archive?id=38890245"
"archive?id=38890062"
"archive?id=38889879"
"archive?id=38889696"
"archive?id=38889513"
"archive?id=38889330"
"archive?id=38889147"
)


# 각 문서에 대해 반복하여 curl 명령 실행
for document in "${list[@]}"; do
  response=$(curl -X POST "https://searchadvisor.naver.com/api-console/request/crawl" \
  -H "Accept: application/json, text/plain, */*" \
  -H "Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7" \
  -H "Cache-Control: no-cache" \
  -H "Content-Type: application/json;charset=UTF-8" \
  -H "Cookie: $cookie" \
  -H "Dnt: 1" \
  -H "Origin: https://searchadvisor.naver.com" \
  -H "Pragma: no-cache" \
  -H "Referer: https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fspace-chat.io" \
  -H "Sec-Ch-Ua: \"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"" \
  -H "Sec-Ch-Ua-Mobile: ?0" \
  -H "Sec-Ch-Ua-Platform: \"Windows\"" \
  -H "Sec-Fetch-Dest: empty" \
  -H "Sec-Fetch-Mode: cors" \
  -H "Sec-Fetch-Site: same-origin" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36" \
  -d "{\"user_enc_id\":\"$user_enc_id\",\"site\":\"$site\",\"document\":\"$document\",\"_csrf\":\"$_csrf\"}")
 # 처리된 문서와 curl 응답 로그 출력
  echo "Processed: $document"
  echo "Response: $response"

  # 1.3초 동안 기다리기
  sleep 1.3
done