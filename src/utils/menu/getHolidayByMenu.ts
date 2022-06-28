export const getHolidayByMenu = (list: number[][]) => {
  if (list.length === 0) return;

  // 판매중지일 먼저
  // 어느 날짜에나 스태퍼는 동일. 인당 제한만
  return list
    ?.map((item: number[]) => {
      const month = item[1];
      const day = item[2];
      // if(){}
      return ` ${month}월 ${day}일`;
    })
    .join();
};
