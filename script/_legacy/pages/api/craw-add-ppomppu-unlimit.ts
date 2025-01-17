import { wrapSleep } from "@/components/function-api/wrapSleep";
import axios from "axios";
import { load } from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";

// curl -GET http://localhost:3000/api/craw-add-ppomppu-unlimit?key=fesojihsfhuvcxuhd
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { key } = req.query;
    if (key !== "fesojihsfhuvcxuhd") return res.status(400).json({ result: null, error: "no params: unknown key" });
    //#endregion

    // COMPLETE to 4080/30000 page
    const max = 2;
    for (let page = 1; page <= max; page++) {
      const response = await fetch(
        `https://www.ppomppu.co.kr/hot.php?id=&page=${page}&category=999&search_type=&keyword=&page_num=&del_flag=&bbs_list_category=0`
      );
      const body = await response.text();

      const $ = load(body);

      const elements = $(".line");

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const href = $(element).find("td:nth-child(4) > a").attr("href");
        if (typeof href != "string") continue;
        await axios
          .get(`http://localhost:3000/api/craw-add-ppomppu?url=https://www.ppomppu.co.kr${encodeURIComponent(href)}`)
          .catch(() => {});
        console.info(
          `[${page}(${i + 1})/${max}]${href} https://www.ppomppu.co.kr${encodeURIComponent(href)}`,
          new Date().toISOString()
        );
        await wrapSleep(100 + Math.floor(Math.random() * 101));
      }

      console.info(`[${page}/${max}] completed!`, new Date().toISOString());
    }
    res.status(200).json({ result: true, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
