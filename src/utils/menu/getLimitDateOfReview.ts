import getCustomDate from '@utils/destination/getCustomDate';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);
dayjs.locale('ko');

const getLimitDateOfReview = (deliveryDate: string) => {
  const { dayFormatter: deliveryAt } = getCustomDate(deliveryDate);
  const writeReviewLimit = dayjs(deliveryDate).add(6, 'day').format('YYYY-MM-DD');
  const { dayFormatter: limitAt } = getCustomDate(writeReviewLimit);

  const today = dayjs();
  const isAvailable = today.isSameOrBefore(writeReviewLimit, 'day');

  return {
    deliveryAt,
    limitAt,
    isAvailable,
  };
};
export default getLimitDateOfReview;
