/**
 * @description 특정 숫자 범위에 따라 간결한 형태의 문자열로 변환하는 작업을 수행합니다.
 * @param number
 * @returns 10 이하: 숫자가 10 이하인 경우, 숫자 자체를 문자열로 반환합니다. 예: 5 → "5"
 * @returns 50 이하: 숫자가 10 초과 50 이하인 경우, "10+" 문자열로 반환합니다.
 * @returns 100 이하: 숫자가 50 초과 100 이하인 경우, "50+" 문자열로 반환합니다.
 * @returns 500 이하: 숫자가 100 초과 500 이하인 경우, "100+" 문자열로 반환합니다.
 * @returns 1000 이하: 숫자가 500 초과 1000 이하인 경우, "500+" 문자열로 반환합니다.
 * @returns 그 외: 1000 초과인 경우, 숫자의 100의 자리를 잘라내고 100을 더한 뒤 끝에 '+' 기호를 붙여 반환합니다. 예: 1234 → "1200+", 5678 → "5700+".
 */
export function toShortNum(n: number) {
  if (!n) return "0";
  if (n <= 10) return n.toString();
  if (n <= 50) return "10+";
  if (n <= 100) return "50+";
  if (n <= 500) return "100+";
  if (n <= 1000) return "500+";
  return (Math.floor(n / 100) * 100 + 100).toString() + "+";
}

// console.info(formatNumber(42));    // 출력: '42'
// console.info(formatNumber(1234));  // 출력: '1.2k'
// console.info(formatNumber(8000000)); // 출력: '8.0M'
