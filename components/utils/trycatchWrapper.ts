import { QueryResult } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next/types";

export type ApiResponseType = { data?: Object | QueryResult; error?: string };
export type HandlerType = (req: NextApiRequest, res: NextApiResponse) => Promise<ApiResponseType>;
export const tryCatchWrapper = async (req: NextApiRequest, res: NextApiResponse, handler: HandlerType) => {
  try {
    const { data, error } = await handler(req, res);
    return res.status(error ? 400 : 200).json({ data, error });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ statusCode: 500, error: message });
  }
};
