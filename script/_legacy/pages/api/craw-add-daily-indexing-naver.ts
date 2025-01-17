import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import sleep from "@/components/util/sleep";

// curl -GET http://localhost:3000/api/craw-add-daily-indexing-naver
const DailyInsertCount = 1;

// 아래 두값 만료되면 수정하기 https://searchadvisor.naver.com/
const _csrf = "4ssTsSnU-z12ir4wXBWivBxQyVokCnbqY3G0";
const Cookie =
  "SADV=s%3AHfijULS1R17MYx-FRsouBEzM1UOunvNu.pmiqGVwJSKeFadBC6l5LbGDlVXowijrCgZZ8EMHkYao; NNB=AJFXYCVTFESGK; nid_inf=-1543844972; NID_AUT=MIOM7Skcg/B0ARYOfHRLRshU0bNwxwfULgS4V2XzI5AGa7NM+lkuca1bhVrkQMYM; NID_SES=AAABhFBqU37XGc4G5CYRBTHk0N5P+7gNE5Q+3liltbA/OIJNLBdAI62yTsgU4ZgbX0NELvjq76m/9TQ1O/Vhf4m34WXtSh6McL3HrsHSblxrxg1ODfGaLqDa9bALDCwf37Xd/hZKCdiV5ZpNXZ2SiAUk4tdPZ/9CmIA6H8CowUZQTnjjcXsAjoAoyCtMTNhc7hSRPHyc/Tm2EQqITOWiOUpTX1Xvk1sf92qRvNGoBZx7UJlrDsgkH+SkEWoeGmnhB2F6hXO1l9heKqiicrqewB0H/PQ0gRH+zYXMDIbZ11CW80z5oJxai2R39UBl3evMZJ0x2aAse/Zv3KPo16EGD4VUO4LawIfzPl4EGt2/i2cb6ZDpXJJ2NgH1/1CmNuqLigLUJXSjCKEuenU6LfqdFdxA4c1DCt8AA3/yGCVtVLqm89eP2RkP4oyj2sXuB3Ecmj6HdKJhM9XfQbkEQFFdcAOaX40HeSG04XIsoIpRPhpTLxUrBgoOUmx0E93c7JC1PIqsx4ugrH5HrzF2JwaNUxDiZrc=; NID_JKL=euwL/iHRlpneWzGes2UqqUfsz+JFy6NPi8eD8825e3s=";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region GET PAGE
    const urlList = await axios
      .get(`http://localhost:3000/api/craw-add-daily-indexing-naver-url`)
      .then((d) => d.data.result as URLListType)
      .catch((e) => console.error(e));

    if (!urlList || urlList.list.length === 0)
      return res.status(400).json({ result: null, error: "No Naver URL List" });
    const list = urlList.list;
    //#endregion

    console.info("Naver URL List Length:", list.length, "current_today:", urlList.current_today);
    // list.length

    for (let index = 0; index < DailyInsertCount - urlList.current_today; index++) {
      const { url, thread_id } = list[index];

      const res = await axios
        .post(
          `https://searchadvisor.naver.com/api-console/request/crawl`,
          {
            document: url,
            site: "https://space-chat.io",
            user_enc_id: "782acf97ad2ef78473550e773b0cc8b8a3538f28a977c3fddd498b9dee6fa5d0",
            _csrf: _csrf,
          },
          { headers }
        )
        .catch((e) => console.error(e));

      //#region query excute
      const query = `INSERT INTO seo_naver_indexed (thread_id) VALUES(?);`;
      await db.query<any>(query, thread_id);

      //#endregion
      const message = res && res.data ? res.data.message : "Fail";
      console.info(`[${index + 1}/${list.length}]`, message, url, thread_id, new Date().toISOString());
      if (message === "Fail" || String(message).includes("MAX")) break;
      await sleep(3000);
    }

    res.status(200).json({ result: true, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

type URLListType = {
  list: {
    url: string; //archive?id=123456789 -> already *183
    thread_id: number;
  }[];
  current_today: number;
};

const headers = {
  Accept: "application/json, text/plain, */*",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
  "Cache-Control": "no-cache",
  "Content-Type": "application/json;charset=UTF-8",
  Cookie: Cookie,
  Dnt: "1",
  Origin: "https://searchadvisor.naver.com",
  Pragma: "no-cache",
  Referer: "https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fspace-chat.io",
  "Sec-Ch-Ua": '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
};
