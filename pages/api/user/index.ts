import { pool } from "@utils/db";
import { NextApiRequest, NextApiResponse } from "next";

// 사용자 목록 조회 또는 사용자 생성
const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (_req.method === "GET") {
      const [users] = await pool.query("SELECT * FROM user WHERE deleted_at IS NULL");
      return res.status(200).json(users);
    }
    if (_req.method === "POST") {
      const { email, twitter_id, password_hash, nickname, profile_picture } = _req.body;
      const [result] = (await pool.query(
        `INSERT INTO user (email, twitter_id, password_hash, nickname, profile_picture) 
         VALUES (?, ?, ?, ?, ?)`,
        [email, twitter_id, password_hash, nickname, profile_picture]
      )) as any;
      return res.status(201).json({ user_id: result.insertId, message: "User created successfully" });
    }
    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ statusCode: 500, message });
  }
};


export default handler;
