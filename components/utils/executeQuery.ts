import { pool } from "@utils/db";

export const executeQuery = async (query: string, values: any[]): Promise<any> => {
  try {
    const [result] = await pool.query(query, values);
    return result;
  } catch (error) {
    throw new Error("Query execution failed: " + error);
  }
};
