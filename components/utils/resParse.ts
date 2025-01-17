import { NextApiRequest } from "next";

/**
 * 파라미터가 숫자로 변환 가능한지 확인하고, 숫자면 그 값을 반환하며,
 * 그렇지 않으면 null을 반환하는 함수입니다.
 *
 * @param value - 숫자로 변환하려는 값 (query 또는 body에서 받아옴)
 * @returns 숫자로 변환 가능한 값이면 그 값을 반환하고, 아니면 null을 반환
 */
export const parseNumber = (value: NextApiRequest["query"] | NextApiRequest["body"]): number | null => (isNaN(Number(value)) ? null : Number(value));

/**
 * 파라미터가 문자열인지를 확인하고, 문자열이면 그 값을 반환하며,
 * 그렇지 않으면 null을 반환하는 함수입니다.
 *
 * @param value - 문자열로 변환하려는 값 (query 또는 body에서 받아옴)
 * @returns 문자열이면 해당 문자열을 반환하고, 아니면 null을 반환
 */
export const parseString = (value: NextApiRequest["query"] | NextApiRequest["body"]): string | null => (typeof value === "string" ? value : null);

/**
 * 파라미터가 숫자로 변환 가능하고, 해당 숫자가 지정된 범위 내에 포함되는지 확인합니다.
 * 숫자로 변환 불가능하거나 범위 밖인 경우 null을 반환하며, 범위 내에 있으면 true를 반환합니다.
 *
 * @param value - 숫자로 변환하려는 값 (query 또는 body에서 받아옴)
 * @param min - 숫자가 포함되어야 할 최소값
 * @param max - 숫자가 포함되어야 할 최대값
 * @returns 숫자가 범위 내에 있으면 true를 반환하고, 그렇지 않으면 null을 반환
 */
export const parseInRange = (value: NextApiRequest["query"] | NextApiRequest["body"], min: number, max: number): number | null => {
  const num = Number(value);
  // 숫자로 변환 불가능하거나 범위 밖인 경우 null 반환
  if (isNaN(num) || num < min || num > max) return null;
  // 범위 내의 유효한 숫자면 true 반환
  return num;
};
