import 'dayjs/locale/ko';
import weekday from 'dayjs/plugin/weekday';
dayjs.locale('ko');
dayjs.extend(weekday);

export const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

import dayjs, { Dayjs } from 'dayjs';

export const getDateFormat = (value: any) => {
  return `${dayjs(value).format('M')}월 ${dayjs(value).format('D')}일 (${dayjs(value).format('dd')})`;
};

export const dateN = (date?: string): number => {
  return Number(dayjs(date).format('YYYYMMDD'));
};

export const afterDateN = (date: string, day: number): number => {
  return Number(dayjs(date).add(day, 'day').format('YYYYMMDD'));
};

export const afterDate = (date: string, day: number): string => {
  return dayjs(date).add(day, 'day').format();
};

export const getWeekDay = (date?: string) => {
  return DAYS[dayjs(date).day()];
}

export const getCurrentDate = () => {
  return dayjs().format('YYYY-MM-DD');
};
