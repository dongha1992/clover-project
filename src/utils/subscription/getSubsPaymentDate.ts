import dayjs from 'dayjs';

export const getSubsPaymentDate = (firstDeliveryDateOrigin: string) => {
  const year = dayjs(firstDeliveryDateOrigin).format('YYYY');
  if ([30, 31, 1, 2].includes(Number(dayjs(firstDeliveryDateOrigin).format('DD')))) {
    const month = dayjs(firstDeliveryDateOrigin).subtract(1, 'month').format('M');
    const day = '27';
    const dd = dayjs(`${year}-${month}-27`).format('dd');
    return { year, month, day, dd };
  } else {
    const month = dayjs(firstDeliveryDateOrigin).format('M');
    const day = dayjs(firstDeliveryDateOrigin).subtract(2, 'day').format('D');
    const dd = dayjs(`${year}-${month}-${day}`).format('dd');
    return { year, month, day, dd };
  }
};
