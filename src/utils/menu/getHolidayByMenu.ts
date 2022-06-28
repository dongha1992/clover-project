export const getHolidayByMenu = (list: number[][]) => {
  if (list.length === 0) return;

  return list
    ?.map((item: number[], index: number) => {
      const month = item[1];
      const day = item[2];

      if (!index) {
        return `${month}월 ${day}일`;
      }

      if (index && list[index - 1][1] !== month) {
        return `${month}월 ${day}일`;
      } else {
        return `${day}일`;
      }
    })
    .join();
};
