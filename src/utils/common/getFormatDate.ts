import 'dayjs/locale/ko';
dayjs.locale('ko');
import dayjs from 'dayjs';

export const getFormatDate = (value: any) => {
  return `${dayjs(value).format('M')}월 ${dayjs(value).format('D')}일 (${dayjs(value).format('dd')})`;
};

export const spotDeliveryCompledN = (date: string): number => {
  return Number(dayjs(date).format('YYYYMMDD'));
};

export const parcelDeliveryCompledN = (date: string): number => {
  return Number(dayjs(date).add(1, 'day').format('YYYYMMDD'));
};

export const todayN = (): number => {
  return Number(dayjs().format('YYYYMMDD'));
};

export const subsClosedDateN = (subscriptionPaymentDate: string) => {
  return Number(dayjs(subscriptionPaymentDate).add(2, 'day').format('YYYYMMDD'));
};
