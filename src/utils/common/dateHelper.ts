import 'dayjs/locale/ko';
import weekday from 'dayjs/plugin/weekday';
dayjs.locale('ko');
dayjs.extend(weekday);

const NUMBER_TYPE_DATE_FORMAT = 'YYYYMMDD';
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

import dayjs from 'dayjs';

export const getDateFormat = (value: any) => {
  return `${dayjs(value).format('M')}월 ${dayjs(value).format('D')}일 (${dayjs(value).format('dd')})`;
};

export const dateN = (date?: string): number => {
  return Number(dayjs(date).format(NUMBER_TYPE_DATE_FORMAT));
};

export const afterDateN = (date: string, day: number): number => {
  return Number(dayjs(date).add(day, 'day').format(NUMBER_TYPE_DATE_FORMAT));
};

export const afterDate = (date: string, day: number): string => {
  return dayjs(date).add(day, 'day').format(DEFAULT_DATE_FORMAT);
};

export const getWeekDay = (date?: string) => {
  return DAYS[dayjs(date).day()];
}

export const getCurrentDate = () => {
  return dayjs().format(DEFAULT_DATE_FORMAT);
};
