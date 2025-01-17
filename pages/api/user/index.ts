import { pool } from "@utils/db";
import { parseInRange, parseNumber, parseString } from "@utils/resParse";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { executeQuery } from "@utils/executeQuery";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest, res: NextApiResponse) => {
  // 없을때 { error: "Method Not Allowed" };
  if (req.method === "GET") return getUserList(req);
  if (req.method === "POST") return createUser(req);
  if (req.method === "PATCH") return updateUser(req);
  if (req.method === "DELETE") return deleteUser(req);
  return { error: "Method Not Allowed" };
};

/** @description GET /user 사용자 목록 조회 */
const getUserList = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const page = parseNumber(req.query.page);
  const limit = parseInRange(req.query.limit, 1, 200);

  if (page === null) return { error: "page is required, number." };
  if (limit === null) return { error: "limit is 1-200." };
  //#endregion

  //#region Query
  const offset = (page - 1) * limit;
  const users = await executeQuery(
    `
      SELECT user_id, nickname FROM user WHERE deleted_at IS NULL LIMIT ? OFFSET ?;
    `,
    [page, offset]
  );
  return { data: users };
  //#endregion
};

/** @description POST /user 사용자 생성 */
const createUser = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const email = parseString(req.body.email);
  const twitter_id = parseString(req.body.twitter_id);
  const password = parseString(req.body.password);
  const nickname = parseString(req.body.nickname);
  const profile_picture = parseString(req.body.profile_picture);

  // 필수값 체크
  if (email === null) return { error: "email is required, string." };
  if (password === null) return { error: "password is required, string." };
  if (nickname === null) return { error: "nickname is required, string." };

  //#endregion

  //#region Query
  const password_hash = await bcrypt.hash(password, 10); // 비밀번호를 해시 처리
  const result = await executeQuery(
    `
      INSERT INTO user (email, twitter_id, password_hash, nickname, profile_picture) VALUES (?, ?, ?, ?, ?)
    `,
    [email, twitter_id, password_hash, nickname, profile_picture]
  );

  return { data: { user_id: result.insertId, message: "User created successfully" } };
  //#endregion
};

// 사용자 정보 수정 (PATCH)
const updateUser = async (req: NextApiRequest): Promise<ApiResponseType> => {
  const buildUpdateQuery = (table: string, fields: Record<string, any>, where: string): { query: string; values: any[] } => {
    const keys = Object.keys(fields).filter((key) => fields[key] !== undefined); // 값이 undefined가 아닌 필드만 추출
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = keys.map((key) => fields[key]);
    if (!setClause) throw new Error("No valid fields provided for update.");
    const query = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    return { query, values };
  };

  const user_id = req.body.user_id;
  if (!user_id) return { error: "user_id is required." };
  // 업데이트할 필드 수집
  const fields = {
    email: req.body.email,
    twitter_id: req.body.twitter_id,
    password_hash: req.body.password ? await bcrypt.hash(req.body.password, 10) : undefined,
    nickname: req.body.nickname,
    profile_picture: req.body.profile_picture,
  };
  // 동적 쿼리 생성
  const { query, values } = buildUpdateQuery("user", fields, "user_id = ? AND deleted_at IS NULL");
  // 쿼리에 user_id 추가
  values.push(user_id);
  // 쿼리 실행
  const result = (await executeQuery(query, values)) as any;
  return result.affectedRows === 0 ? { error: "User not found or already deleted." } : { data: { user_id, message: "User updated successfully." } };
};

// 사용자 삭제 (DELETE)
const deleteUser = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const user_id = parseNumber(req.body.user_id);
  if (user_id === null) return { error: "user_id is required, string." };
  //#endregion

  const [result] = (await pool.query(`UPDATE user SET deleted_at = NOW() WHERE user_id = ? AND deleted_at IS NULL`, [user_id])) as any;
  if (result.affectedRows === 0) return { error: "User not found or already deleted" };
  return { data: { user_id, message: "User deleted successfully" } };
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, handler);
