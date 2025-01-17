import { Client } from "@elastic/elasticsearch";
const apiKey = "cnplWDg0c0Jrc05JRU0zUGhsNEY6aUc2dEdaXzBUc1NmSVlJU2dUVnp3Zw=="; // 생성한 API 키의 인코딩된 값
export const esClient = new Client({ node: "http://43.202.239.147:9200", auth: { apiKey: apiKey } });

/**
 ElasticSearch DB 구조

 인덱스 추가
 curl -X PUT "localhost:9200/thread_index" -H "Authorization: ApiKey cnplWDg0c0Jrc05JRU0zUGhsNEY6aUc2dEdaXzBUc1NmSVlJU2dUVnp3Zw==" -H 'Content-Type: application/json' -d @thread_index.json
 curl -X PUT "localhost:9200/thread_public" -H "Authorization: ApiKey cnplWDg0c0Jrc05JRU0zUGhsNEY6aUc2dEdaXzBUc1NmSVlJU2dUVnp3Zw==" -H 'Content-Type: application/json' -d @thread_public.json

 인덱스 설정
 curl -X PUT "localhost:9200/_settings" -H "Authorization: ApiKey cnplWDg0c0Jrc05JRU0zUGhsNEY6aUc2dEdaXzBUc1NmSVlJU2dUVnp3Zw==" -H 'Content-Type: application/json' -d'
{
  "index" : {
      "number_of_replicas" : 0
  }
}'

 동작확인 green 떠야함
curl -X GET "localhost:9200/_cluster/health?pretty" -H "Authorization: ApiKey cnplWDg0c0Jrc05JRU0zUGhsNEY6aUc2dEdaXzBUc1NmSVlJU2dUVnp3Zw=="

 용량 확인
curl -X GET "localhost:9200/_cat/shards?v" -H "Authorization: ApiKey cnplWDg0c0Jrc05JRU0zUGhsNEY6aUc2dEdaXzBUc1NmSVlJU2dUVnp3Zw=="

 */

/* API키
Changed password for user apm_system
PASSWORD apm_system = C18izFBPfaOh6TfB9Kdg

Changed password for user kibana_system
PASSWORD kibana_system = BWwhWWMRCIr9K5J9FwUx

Changed password for user kibana
PASSWORD kibana = BWwhWWMRCIr9K5J9FwUx

Changed password for user logstash_system
PASSWORD logstash_system = H9KmMlWXAq8zUiPpISo9

Changed password for user beats_system
PASSWORD beats_system = jRJ1yv0id7w1GJIyh1e8

Changed password for user remote_monitoring_user
PASSWORD remote_monitoring_user = JX2uc8xzbIN7DsST865X

Changed password for user elastic
PASSWORD elastic = 8Xtry5ju1wJkef7Xd2S7

const username = "elastic";
const password = "8Xtry5ju1wJkef7Xd2S7"; // 정확한 비밀번호 사용
const encodedCredentials = btoa(`${username}:${password}`);
console.info(encodedCredentials);

curl -X POST "localhost:9200/_security/api_key" -H "Authorization: Basic ZWxhc3RpYzo4WHRyeTVqdTF3SmtlZjdYZDJTNw==" -H "Content-Type: application/json" -d '{
  "name": "elastic",
  "expiration": "365d"  // API 키의 유효 기간을 설정할 수 있습니다.
}'

{"id":"rzeX84sBksNIEM3Phl4F","name":"elastic","expiration":1732134875207,"api_key":"iG6tGZ_0TsSfIYISgTVzwg","encoded":"cnplWDg0c0Jrc05JRU0zUGhsNEY6aUc2dEdaXzBUc1NmSVlJU2dUVnp3Zw=="}
*/
