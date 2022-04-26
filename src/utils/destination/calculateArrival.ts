import dayjs from 'dayjs';

const calculateArrival = (
  day: string,
  disabledDates: string[] = []
): string => {
  // 배송불가 날짜 제외 로직

  let rDay = day;
  let start = false;

  if (disabledDates.length === 0) {
    // 배송불가 날짜가 없는 경우
    return dayjs(day).format('YYYY-MM-DD');
  } else {
    for (let i = 0; i < disabledDates.length; i++) {
      if (disabledDates[i] === rDay) {
        start = true;
        rDay = dayjs(rDay).add(1, 'day').format('YYYY-MM-DD');
        if (i === disabledDates.length - 1) {
          // 배송불가 날짜 제외한 도착날짜 (배송불가 날짜 Array 전체 제외)
          return dayjs(rDay).format('YYYY-MM-DD');
        }
      } else {
        if (start) {
          // 배송불가 날짜 제외한 도착날짜
          return dayjs(rDay).format('YYYY-MM-DD');
        }
        if (i === disabledDates.length - 1 && rDay === day) {
          // 도착날짜에 배송불가 날짜가 없을 경우
          return dayjs(day).format('YYYY-MM-DD');
        }
      }
    }
  }
  return dayjs(day).format('YYYY-MM-DD');
};

export default calculateArrival;
