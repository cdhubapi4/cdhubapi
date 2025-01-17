// # chrome 들어가서 로그인하고 매일 seo 50개씩 자동 등록해주는 api
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import puppeteer from "puppeteer";

// curl -GET "http://localhost:3000/api/seo-naver"
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region query excute
    //type=megaphone / tag=update
    const limit = 10; //default : 10
    const query = `select concat("archive?id=",thread_id  * 183) archive_url  from thread_public tp order by thread_id  desc limit ${limit}`;
    const result = await db.query<{ archive_url: number }[]>(query);
    if (!result) return res.status(400).json({ result: null, error: "no data" });
    // headless: false로 설정하면 브라우저가 화면에 보입니다.
    // const browser = await puppeteer.launch({ headless: false });
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    // 로그인 페이지로 이동
    await page.goto("https://searchadvisor.naver.com/console/site/request/crawl?site=https%3A%2F%2Fspace-chat.io");
    // 사용자 이름 입력 필드가 로드될 때까지 기다립니다.
    await page.waitForSelector('input[id="id"]', { visible: true });
    // 로그인 정보 입력 및 제출
    await page.type('input[id="id"]', "spacechatio", { delay: 150 });
    await page.type('input[id="pw"]', "spacechaT&*^@", { delay: 150 });
    await page.click(".btn_login");
    // 로그인 후 처리할 작업들을 이곳에 작성합니다.
    await page.waitForSelector("div.v-text-field__slot > input", { visible: true });
    const SITE = "https://space-chat.io/";
    // 각 URL에 대한 작업 수행
    for (const item of result) {
      const url = item.archive_url;
      await page.type("div.v-text-field__slot > input", SITE + url, { delay: 10 });
      await page.waitForSelector("div.pl-6.col.col-auto > button.font-weight-bold", { visible: true });
      await page.click("div.pl-6.col.col-auto > button.font-weight-bold");
      // 각 작업 간 충분한 지연을 두어 서버에 과부하가 가지 않도록 합니다.
      await new Promise((r) => setTimeout(r, 1000)); // 1초 대기, 필요에 따라 조정 가능
      // 로딩이 없어질 때까지 기다립니다.
      await page.waitForFunction(() => !document.querySelector("circle.v-progress-circular__overlay"));
      // 입력 필드의 내용을 백스페이스로 지웁니다.
      await page.click("div.v-text-field__slot > input");
      for (let i = 0; i < (SITE + url).length + 1; i++) {
        await page.keyboard.press("Backspace");
      }
    }
    // 브라우저 닫기
    await browser.close();
    res.status(200).json({ result: true });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
