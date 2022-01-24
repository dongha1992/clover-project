export const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface IResult {
  years: number;
  months: number;
  dates: number;
  hours: number;
  minutes: number;
  seconds: number;
  dayFormatter: string;
  dayFormatterHyphen: string;
}

const getCustomDate = (inputDate: Date): IResult => {
  const originalDate = new Date(inputDate);

  const strYears = `${originalDate.getFullYear()}`;
  let strMonths = `${originalDate.getMonth() + 1}`;
  let strDates = `${originalDate.getDate()}`;

  const years = originalDate.getFullYear();
  const months = originalDate.getMonth();
  const hours = originalDate.getHours();
  const minutes = originalDate.getMinutes();
  const seconds = originalDate.getSeconds();
  const dates = originalDate.getDate();

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
    hours,
    minutes,
    seconds,
    dayFormatter: `${strMonths}.${strDates} (${days})`,
    dayFormatterHyphen: `${strYears}-${strMonths}-${strDates}`,
  };
};

export default getCustomDate;
