const fs = require("fs");
const prettier = require("prettier");

const getDate = new Date().toISOString();
const CODEIT_DOMAIN = "https://space-chat.io";
const publicPath = "c:/_projects/spacechat/front/space-chat-vercel/public";

const formatted = (sitemap: any) => prettier.format(sitemap, { parser: "html" });

const execute = async () => {
  const directoryPath = `${publicPath}/sitemap`;
  const files = fs.readdirSync(directoryPath).filter((file: string) => file.endsWith(".gz"));

  const pages = files.map((file: any) => `${directoryPath}/${file}`);

  const sitemapIndex = `
    ${pages
      .map((page: string) => {
        const path = page.replace(`${publicPath}/`, "");
        return `
          <sitemap>
            <loc>${`${CODEIT_DOMAIN}/${path}`}</loc>
            <lastmod>${getDate}</lastmod>
          </sitemap>`;
      })
      .join("")}
  `;

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapIndex}
    </sitemapindex>
  `;

  const formattedSitemap = await formatted(sitemap);

  fs.writeFileSync(`${publicPath}/sitemap.xml`, formattedSitemap, "utf8");
};

execute();
