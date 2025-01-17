import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

// curl -GET "http://localhost:3000/api/seo-search?page=0&size=10"
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //#region params check
    const { page, size } = req.query as {
      page: string;
      size: string;
    };
    if (typeof page !== "string") return res.status(400).json({ result: null, error: "no query: page" });
    if (typeof size !== "string") return res.status(400).json({ result: null, error: "no query: size" });
    //#endregion

    //#region query excute
    //type=megaphone / tag=update
    const result1 = await db
      .query<any>(`SELECT 1 FROM temp_cleaned_keywords LIMIT 1;`)
      .then(() => true)
      .catch(() => false);

    if (result1 === false) {
      const getTitleSpaceLengthQuery = `select MAX(LENGTH(title) - LENGTH(REPLACE(title, ' ', ''))) AS max_space_count from thread_public;`;
      const data1 = await db.query<{ max_space_count: number }[]>(getTitleSpaceLengthQuery);
      if (!data1 || data1.length === 0) return res.status(400).json({ error: "no data1 seo-search" });
      // const spaceNum = data1[0].max_space_count;
      const spaceNum = 2;

      const query2 = `CREATE TEMPORARY TABLE temp_cleaned_keywords AS
      ${getAllSearchUrlQuery(spaceNum)};`;

      await db.query<any>(query2);
    }

    const query3 = `
    SELECT keyword q, created_at FROM temp_cleaned_keywords
    LIMIT ${Number(size)} offset ${Number(size) * Number(page)};`;
    const result3 = await db.query<any>(query3);
    res.status(200).json({ result: result3 });
    //#endregion
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};

export const getAllSearchUrlQuery = (spaceNum: number) => {
  const array = Array.from({ length: spaceNum }, (v, i) => i + 1);
  let queryString = `SELECT keyword, max(created_at) AS created_at
    FROM (
      SELECT thread_id, REPLACE(TRIM(title), ' ', '-') as keyword, created_at
    FROM thread_public
    WHERE title is not null
    UNION ALL
  `;
  for (let index = 1; index <= array.length; index++) {
    const newArray = Array.from({ length: spaceNum }, (v, i) => i + 1);
    const tempString = newArray.reduce((acc, cur) => {
      return (acc += ` SELECT thread_id, REPLACE(SUBSTRING_INDEX(SUBSTRING_INDEX(title , ' ', ${cur}), ' ', -${index}),' ', '-') AS keyword, created_at
      FROM thread_public
      WHERE title is not null
      UNION ALL`);
    }, ``);
    const slicedString = array.length === index ? tempString.slice(0, -9) : tempString;
    queryString += slicedString;
  }

  return (
    queryString +
    `) AS t
GROUP BY keyword`
  );
};
