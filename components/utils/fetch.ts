import axios, { AxiosError, AxiosRequestConfig } from "axios";

// API URL 목록
const apiUrls = [
  "https://www.cdhub.org/api",
  // "https://api-cdhub-a.up.railway.app/api",
  // "https://api-cdhub-b.up.railway.app/api",
  // "https://api-cdhub-c.up.railway.app/api",
  // "https://api-cdhub-d.up.railway.app/api",
];

// 랜덤으로 BASE_URL을 선택하는 함수
// axios.get(`${getBaseURL()}/api/user?page=1&size=10`).then((d) => console.log(d.data));

// 요청 파라미터 타입 정의
interface RequestParams {
  [key: string]: any;
}

// 응답 타입 정의
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// 랜덤으로 BASE_URL을 선택하는 함수
const getBaseURL = (): string => apiUrls[Math.floor(Math.random() * apiUrls.length)];

// axios 요청 함수
const fetch = async <T>(method: "GET" | "POST" | "PATCH" | "DELETE", url: "/user", params?: RequestParams): Promise<ApiResponse<T> | void> => {
  const baseUrl = getBaseURL();
  const fullUrl = `${baseUrl}${url}`;

  const config: AxiosRequestConfig = { method, url: fullUrl };
  if (method === "GET") config.params = params; // GET 요청은 쿼리 파라미터로 전달
  else config.data = params; // POST, PATCH, DELETE는 본문에 파라미터 전달

  const response = await axios(config)
    .then((d) => ({ data: d.data, status: d.status }))
    .catch((d) => console.error("ERROR : AXIOS", d));
  // .catch((d: AxiosError) => ({error: (d as any).response.data || "서버 오류", status: d.status}));
  return response;
};

export default fetch;
