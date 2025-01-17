import { ApiResponseType, HandlerType, tryCatchWrapper } from "@api/trycatchWrapper";
import { pool } from "@utils/db";
import { NextApiRequest, NextApiResponse } from "next";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest, res: NextApiResponse)=> {
  switch (req.method) {
    case "GET":
      return getUsers();
    case "POST":
      return createUser(req);
    case "PATCH":
      return { error: "Method Not Allowed" };
    case "DELETE":
      return { error: "Method Not Allowed" };
    default:
      return { error: "Method Not Allowed" };
  }
};

// 사용자 목록 조회
const getUsers = async (): Promise<ApiResponseType> => {
  const [users] = await pool.query("SELECT * FROM user WHERE deleted_at IS NULL");
  return { data: users };
};

// 사용자 생성
const createUser = async (req: NextApiRequest): Promise<ApiResponseType> => {
  const { email, twitter_id, password_hash, nickname, profile_picture } = req.body;
  const [result] = await pool.query(`INSERT INTO user (email, twitter_id, password_hash, nickname, profile_picture) VALUES (?, ?, ?, ?, ?)`, [email, twitter_id, password_hash, nickname, profile_picture]) as any;
  return { data: { user_id: result.insertId, message: "User created successfully" } };
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, handler);
