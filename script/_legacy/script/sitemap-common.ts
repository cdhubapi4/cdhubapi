// sitemap-common.js

const fs = require("fs");
const prettier = require("prettier");

const publicPath = "c:/_projects/spacechat/front/space-chat-vercel/public";
const formatted = (sitemap: any) => prettier.format(sitemap, { parser: "html" });

const execute = async () => {
  // 포함할 페이지와 제외할 페이지 등록
  // const pages = await globby([
  //   // include
  //   '../pages/**/*.tsx',
  //   '../pages/*.tsx',
  //   // exclude
  //   '!../pages/_app.tsx',
  //   '!../pages/_document.tsx',
  //   '!../pages/_error.tsx',
  //   '!../pages/admin/*.tsx',
  //   '!../pages/api/*.tsx',
  //   // (...중간 생략)
  //   '!../pages/**/[t_id]/*.tsx',
  //   '!../pages/**/[t_id]/**/*.tsx',
  // ]);

  // // ../pages/category/index.tsx -> https://wwww.codeit.kr/category
  // // ../pages/community/threads -> https://wwww.codeit.kr/community/threads
  // const pagesSitemap = `
  //   ${pages
  //     .map(page => {
  //       const path = page
  //         .replace('../pages/', '')
  //         .replace('.tsx', '')
  //         .replace(/\/index/g, '');
  //       const routePath = path === 'index' ? '' : path;
  //       return `
  //         <url>
  //           <loc>${CODEIT_DOMAIN}/${routePath}</loc>
  //           <lastmod>${getDate}</lastmod>
  //           <<changefreq>daily</changefreq>>daily</<changefreq>daily</changefreq>>
  //           <priority>1.0</priority>
  //         </url>
  //       `;
  //     })
  //     .join('')}`;

  // const generatedSitemap = `
  // <?xml version="1.0" encoding="UTF-8"?>
  //   <urlset
  //     xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  //     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  //    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  //     ${pagesSitemap}
  //   </urlset>`;
  const generatedSitemap = `
  <?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
  <url>
    <loc>https://space-chat.io/</loc>
    <lastmod>2023-09-05T00:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://space-chat.io/landing</loc>
    <lastmod>2023-09-05T00:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://space-chat.io/dino-game</loc>
    <lastmod>2023-09-05T00:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  const formattedSitemap = await formatted(generatedSitemap);

  fs.writeFileSync(`${publicPath}/sitemap/common.xml`, formattedSitemap, "utf8");
};
execute();
