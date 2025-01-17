import axios from "axios";
import { load } from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";

// curl -GET http://localhost:3000/api/craw-add-thredic-unlimit?key=afehliuaeaseihul
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { key } = req.query;
    if (key !== "afehliuaeaseihul") return res.status(400).json({ result: null, error: "no params: unknown key" });
    //#endregion

    // COMPLETE to 5685/21000 page
    const max = 3;
    for (let page = 1; page < max; page++) {
      //21000
      const response = await fetch(`https://thredic.com/index.php?mid=all&page=${page}`);
      const body = await response.text();

      const $ = load(body);

      const elements = $("div.board_list > a");

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const href = $(element).attr("href");
        await axios.get(`http://localhost:3000/api/craw-add-thredic?url=https://thredic.com${href}`).catch(() => {});
        // .catch((e) => console.error(e.response.data.error));
        console.info(`[${page}(${i + 1})/${max - 1}] https://thredic.com${href}`, new Date().toISOString());
      }

      console.info(`[${page}/${max - 1}]`, new Date().toISOString());
    }
    res.status(200).json({ result: true, error: null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
