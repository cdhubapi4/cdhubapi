// robots.js
// #DaumWebMasterTool:8298072417f5ef23466084bf7b4199de4be153dc83b9b497c308c5d3d9fad81a:6BcZ8wvX83qTA4T4UNcYzg==
// site: https://space-chat.io/
// pwd: tkarnr78^@
const fs = require("fs");

const publicPath = "c:/_projects/spacechat/front/space-chat-vercel/public";
const excute = async () => {
  const generatedSitemap = `User-agent: *
Allow: /
Disallow: /admin/ 
Disallow: /private/
Sitemap: https://space-chat.io/sitemap.xml
#DaumWebMasterTool:8298072417f5ef23466084bf7b4199de4be153dc83b9b497c308c5d3d9fad81a:6BcZ8wvX83qTA4T4UNcYzg==`;

  fs.writeFileSync(`${publicPath}/robots.txt`, generatedSitemap, "utf8");
};

excute();
