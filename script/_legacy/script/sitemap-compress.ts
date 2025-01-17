
const fs = require("fs");
const zlib =require("zlib");
const dirs = ["../public/sitemap"];

const execute = async () => {
  dirs.forEach((dir) => {
    fs.readdirSync(dir).forEach((file: string) => {
      if (file.endsWith(".xml") && file !== "sitemap.xml") {
        // gzip
        const fileContents = fs.createReadStream(dir + "/" + file);
        const writeStream = fs.createWriteStream(dir + "/" + file + ".gz");
        const zip = zlib.createGzip();

        fileContents
          .pipe(zip)
          .on("error", (err: any) => console.error(err))
          .pipe(writeStream)
          .on("error", (err: any) => console.error(err));
      }
    });
  })
}

execute()