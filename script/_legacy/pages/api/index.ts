import { NextApiRequest, NextApiResponse } from "next";

/**
req.cookies
req.body
res.status(<status code>)
res.send(<Body>)
res.json(<JSON>)
res.redirect(<URL>)
res.redirect(<status code>, <URL>)
 */
export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send("Server is Running ..." + new Date().toISOString());
};
