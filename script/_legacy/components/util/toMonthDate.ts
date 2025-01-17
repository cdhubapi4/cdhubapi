/**
 * @description 문자열로 입력된 날짜를 Date 객체로 변환한 후, 현재 년도와 입력된 년도가 다르면 년도를 붙이고, 같으면 월과 일만 반환합니다.
 * @param dateString YYYY-MM-DD HH:mm:ss 형식을 따릅니다
 * @returns
 */
export function toMonthDate(dateString: string) {
  const inputDate = new Date(dateString);
  const currentYear = new Date().getFullYear();
  let formattedDate = `${inputDate.getMonth() + 1}`.padStart(2, "0") + "-" + `${inputDate.getDate()}`.padStart(2, "0");
  if (inputDate.getFullYear() !== currentYear) formattedDate = inputDate.getFullYear() + "-" + formattedDate;
  return formattedDate;
}
// const date = "2023-06-25 05:31:12";
// console.info(formatDate(date)); // 출력: '06-25'
