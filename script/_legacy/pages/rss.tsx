import fs from "fs";
import path from "path";
import { GetServerSideProps } from "next";

const RSSPage = () => null;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const xmlPath = path.join(process.cwd(), "public", "rss.xml");
  const xmlContent = fs.readFileSync(xmlPath, "utf8");
  context.res.setHeader("Content-Type", "text/xml");
  context.res.write(xmlContent);
  context.res.end();
  return { props: {} };
};

export default RSSPage;
