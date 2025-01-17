const fs = require("fs");
const prettier = require("prettier");
const dayjs = require("dayjs");
const axios = require("axios");

// 오늘 날짜 가져오기 & 도메인 설정
const getDate = new Date().toISOString();
const publicPath = "c:/_projects/spacechat/front/space-chat-vercel/public";
const size = 3000;

const formatted = (sitemap: string) => prettier.format(sitemap, { parser: "html" });
const execute = async () => {
  // let page = 0;
  let page = 73;
  while (true) {
    const URLList: { title_regex: string; created_at: string; thread_id_mul: number }[] = await axios
      .get(`http://localhost:3000/api/seo-archive?page=${page}&size=${size}`)
      .then((res: any) => res.data.result)
      .catch((e: any) => {
        console.error(e.response);
        return [];
      });

    if (!URLList) return;

    console.info("sitemap-thread-public.ts page:", page + 1);

    const postListSitemap = `
    ${URLList.map(({ thread_id_mul, created_at }) => {
      const currentYear = new Date().getFullYear();
      const postYear = new Date(created_at).getFullYear();
      const yearDifference = currentYear - postYear;
      const priority = Math.max(1.0 - yearDifference * 0.1, 0.5);
      return `
        <url>
          <loc>${`https://space-chat.io/archive?id=${thread_id_mul}`}</loc>
          <lastmod>${dayjs(created_at ? created_at : new Date(), "YYYY-MM-DD HH:mm:ss").toISOString()}</lastmod>
          <changefreq>yearly</changefreq>
          <priority>${priority}</priority>
        </url>`;
    }).join("")}
`;

    const generatedSitemap = `
	<?xml version="1.0" encoding="UTF-8"?>
  	<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
  >
    ${postListSitemap}
  </urlset>
`;

    const formattedSitemap = await formatted(generatedSitemap);

    fs.writeFileSync(`${publicPath}/sitemap/archive${page + 1}.xml`, formattedSitemap, "utf8");

    if (URLList.length < size) break;
    page++;
  }
};
execute();
