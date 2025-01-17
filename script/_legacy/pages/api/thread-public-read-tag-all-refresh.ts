import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // 1. GET realtime thread_public_tag_all
    const query = `
  INSERT INTO thread_public_tag_all_cache (tag, latest_modified_at, count)
  SELECT 
    tag, 
    MAX(modified_at) AS latest_modified_at, 
    COUNT(thread_id) AS \`count\`
  FROM 
    thread_public_tag
  GROUP BY 
    tag
  ORDER BY 
    \`count\` DESC
  ON DUPLICATE KEY UPDATE
    latest_modified_at = VALUES(latest_modified_at), 
    count = VALUES(count);
`;
    await db.query(query);
    //#endregion
    res.status(400).json({ result: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ result: null, error });
  }
};
