const fs = require("fs");
const prettier = require("prettier");
const dayjs = require("dayjs");
const axios = require("axios");

// 오늘 날짜 가져오기 & 도메인 설정
const getDate = new Date().toISOString();
const publicPath = "c:/_projects/spacechat/front/space-chat-vercel/public";

const formatted = (sitemap: string) => prettier.format(sitemap, { parser: "html" });
const execute = async () => {
  const URLList: {
    title: string;
    thread_id_mul: number;
    description: string;
    pubDate: string;
    guid: number;
    author: string;
    category: string;
  }[] = await axios
    .get(`http://localhost:3000/api/seo-archive-rss`)
    .then((res: any) => res.data.result)
    .catch((e: any) => {
      console.error(e.response);
      return [];
    });

  if (!URLList) return;

  console.info("rss-thread-public");

  const escapeXML = (str: string) => {
    if (!str) return "";

    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&apos;")
      .replace(/"/g, "&quot;");
  };

  const postListSitemap = `
    ${URLList.map((post) => {
      const link = `https://space-chat.io/archive?id=${post.thread_id_mul}`;
      const category = JSON.parse(post.category)
        .map((c: string) => `            <category>${escapeXML(c)}</category>`)
        .join("\n");

      return `
        <item>
            <title>${escapeXML(post.title)}</title>
            <link>${escapeXML(link)}</link>
            <description>${escapeXML(post.description)}</description>
            <pubDate>${escapeXML(post.pubDate)}</pubDate>
            <guid isPermaLink="true">${post.guid}</guid>
            <author>${escapeXML(post.author)}</author>
${category}
            <enclosure url="https://space-chat.io/favicon.ico" length="1619" type="image/x-icon" />
        </item>`;
    }).join("")}
`;

  const generatedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
        <title>스페이스챗 커뮤니티</title>
        <link>https://space-chat.io/community</link>
        <description>스페이스챗의 최신 게시글</description>
        <language>ko</language>
        <managingEditor>${"spacechat.io@gmail.com"}</managingEditor>
        <webMaster>${"spacechat.io@gmail.com"}</webMaster>
        <image>
            <url>https://space-chat.io/favicon.ico</url>
            <title>스페이스챗</title>
            <link>https://space-chat.io</link>
        </image>
        <category>채팅</category>
        <docs>http://blogs.law.harvard.edu/tech/rss</docs>
        <ttl>60</ttl>
    ${postListSitemap}
  </channel>
</rss>
`;

  const formattedSitemap = generatedSitemap;

  fs.writeFileSync(`${publicPath}/rss.xml`, formattedSitemap, "utf8");
};
execute();
