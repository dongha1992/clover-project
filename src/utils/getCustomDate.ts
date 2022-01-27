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
  dayFormatterHyphen: string;
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

  const strYears = `${originalDate.getFullYear()}`;
  let strMonths = `${originalDate.getMonth() + 1}`;
  let strDates = `${originalDate.getDate()}`;

  const years = originalDate.getFullYear();
  const months = originalDate.getMonth();
  const hours = originalDate.getHours();
  const minutes = originalDate.getMinutes();
  const seconds = originalDate.getSeconds();
  const dates = originalDate.getDate();

  console.log(seconds);

  const days = DAYS[originalDate.getDay()];

  if (strMonths.length === 1) {
    strMonths = `0${strMonths}`;
  }
  if (strDates.length === 1) {
    strDates = `0${strDates}`;
  }

  return {
    years,
    months,
    dates,
    days,
    hours,
    minutes,
    seconds,
    dayFormatter: `${strMonths}.${strDates} (${days})`,
    dayFormatterHyphen: `${strYears}-${strMonths}-${strDates}`,
  };
};

export default getCustomDate;
