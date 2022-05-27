import 'dayjs/locale/ko';
import dayjs from 'dayjs';

const getFormatDate = (value: any) => {
  return `${dayjs(value).format('M')}월 ${dayjs(value).format('D')}일 (${dayjs(value).format('dd')})`;
};
export default getFormatDate;
