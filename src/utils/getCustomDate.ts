import { getFormatTime } from '@utils/getFormatTime';

export const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface IResult {
  years: number;
  months: number;
  dates: number;
  hours: number;
  minutes: number;
  seconds: number;
  days: string;
  dayFormatter: string;
  currentDate: string;
  currentTime: number;
}

const getCustomDate = (inputDate: Date): IResult => {
  /**
   * PC 설정 시간대 상관 없이 한국 표준시 반환
   * locale은 대응하지만 시스템시간 자체를 변경하는 경우는 대응 불가. 이 경우 timestamp API를 이용하여 서버시간을 이용해야 함.
   */
  const now = inputDate;
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const KOR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const CURRENT_KOR_DATE = new Date(utc + KOR_TIME_DIFF);

  const originalDate = new Date(CURRENT_KOR_DATE);

  const strYears = originalDate.getFullYear();
  const strMonths = originalDate.getMonth() + 1;
  const strDates = originalDate.getDate();

  const years = originalDate.getFullYear();
  const months = originalDate.getMonth();
  const hours = originalDate.getHours();
  const minutes = originalDate.getMinutes();
  const seconds = originalDate.getSeconds();
  const dates = originalDate.getDate();

  const days = DAYS[originalDate.getDay()];

  return {
    years,
    months,
    dates,
    days,
    hours,
    minutes,
    seconds,
    dayFormatter: `${strMonths}월 ${strDates}일 (${days})`,
    currentDate: `${strYears}-${getFormatTime(months + 1)}-${getFormatTime(dates)}`,
    currentTime: Number(`${getFormatTime(hours)}.${getFormatTime(minutes)}`),
  };
};

export default getCustomDate;