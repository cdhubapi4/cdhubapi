import axios from "axios";
import { load } from "cheerio";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

// curl -GET http://localhost:3000/api/craw-add-natepan-unlimit?key=zsdiuhvsdhoivduhoisd
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { key } = req.query;
    if (key !== "zsdiuhvsdhoivduhoisd") return res.status(400).json({ result: null, error: "no params: unknown key" });
    //#endregion

    const max = 2;
    for (let page = 1; page <= max; page++) {
      //21000
      const url = `https://m.pann.nate.com/talk/today/${dayjs()
        .subtract(page - 1, "day")
        .format("YYYYMMDD")}`;
      const response = await fetch(url);
      const body = await response.text();

      const $ = load(body);
      const elements = $("#wrap > div.list-wrap > ul > li > a");
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const href = `https://m.pann.nate.com${$(element).attr("href")}`;
        await axios.get(`http://localhost:3000/api/craw-add-natepan?url=${href}`).catch(() => {});
        console.info(`[${page}(${i + 1})/${max}]`, href, new Date().toISOString());
      }
      console.info(`[${page}/${max}]`, new Date().toISOString());
    }
    res.status(200).json({ result: true, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
