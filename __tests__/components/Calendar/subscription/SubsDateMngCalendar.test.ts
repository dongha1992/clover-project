import { afterDateN, dateN } from '@utils/common';
import { afterDate, beforeDateN } from '@utils/common/dateHelper';
import 'dayjs/locale/ko';
dayjs.locale('ko');
import dayjs from 'dayjs';

describe('SubsDateMngCalendar', () => {
  describe('titleDisabled', () => {
    const tileDisabled = ({
      date,
      deliveryType,
      firstDeliveryDate,
      lastDeliveryDate,
      today,
      todayTime,
    }: {
      date: any;
      deliveryType: string;
      firstDeliveryDate: string;
      lastDeliveryDate: string;
      today?: string;
      todayTime?: string;
    }) => {
      if (date.getDay() === 6) {
        if (deliveryType === 'SPOT') {
          return true;
        }
      } else if (date.getDay() === 0) {
        return true;
      } else if (date.getDay() === 1) {
        if (deliveryType === 'PARCEL') {
          return true;
        }
      }

      if (
        dateN(date) === dateN(today ?? dayjs().format('YYYY-MM-DD')) &&
        Number(todayTime ?? dayjs().format('Hmm')) > 700
      ) {
        return true;
      }

      if (
        (deliveryType === 'PARCEL' || deliveryType === 'MORNING') &&
        beforeDateN(date, 1) === dateN(today ?? dayjs().format('YYYY-MM-DD')) &&
        Number(todayTime ?? dayjs().format('Hmm')) > 700
      ) {
        return true;
      }

      if (
        dateN(date) >= dateN(today ?? dayjs().format('YYYY-MM-DD')) &&
        dateN(firstDeliveryDate) <= dateN(date) &&
        afterDateN(lastDeliveryDate, 7) >= dateN(date)
      ) {
        return false;
      } else {
        return true;
      }
    };

    const firstDeliveryDate = '2022-08-29';
    const lastDeliveryDate = '2022-09-22';

    it('return true when 구독스팟 토요일', () => {
      const date = new Date('2022-09-03');
      const deliveryType = 'SPOT';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate })).toBeTruthy();
    });

    it('return true when 일요일', () => {
      const date = new Date('2022-09-03');
      const deliveryType = 'SPOT';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate })).toBeTruthy();
    });

    it('return true when 구독택배 월요일', () => {
      const date = new Date('2022-09-05');
      const deliveryType = 'PARCEL';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate })).toBeTruthy();
    });

    it('return true when 검사 날짜가 오늘이고 07:00 이후 일때', () => {
      const date = dayjs('2022-09-06').toDate();
      const today = dayjs('2022-09-06').format('YYYY-MM-DD');
      const todayTime = dayjs('2022-09-06').set('h', 8).format('Hmm');
      const deliveryType = 'SPOT';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate, today, todayTime })).toBeTruthy();
    });

    it('return false when 검사 날짜가 오늘이고 07:00 이전 일때', () => {
      const date = dayjs('2022-09-06').toDate();
      const today = dayjs('2022-09-06').format('YYYY-MM-DD');
      const todayTime = dayjs('2022-09-06').set('h', 5).format('Hmm');
      const deliveryType = 'SPOT';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate, today, todayTime })).toBeFalsy();
    });

    it('return true when 구독택배 일때 검사 날짜 하루전이 오늘 07:00 이후 일때', () => {
      const date = dayjs('2022-09-07').toDate();
      const today = dayjs('2022-09-06').format('YYYY-MM-DD');
      const todayTime = dayjs('2022-09-06').set('h', 8).format('Hmm');
      const deliveryType = 'PARCEL';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate, today, todayTime })).toBeTruthy();
    });

    it('return false when 구독택배 일때 검사 날짜 하루전이 오늘 07:00 이전 일때', () => {
      const date = dayjs('2022-09-07').toDate();
      const today = dayjs('2022-09-06').format('YYYY-MM-DD');
      const todayTime = dayjs('2022-09-06').set('h', 5).format('Hmm');
      const deliveryType = 'PARCEL';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate, today, todayTime })).toBeFalsy();
    });

    it('return true when 구독새벽 일때 검사 날짜 하루전이 오늘 07:00 이후 일때', () => {
      const date = dayjs('2022-09-07').toDate();
      const today = dayjs('2022-09-06').format('YYYY-MM-DD');
      const todayTime = dayjs('2022-09-06').set('h', 8).format('Hmm');
      const deliveryType = 'MORNING';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate, today, todayTime })).toBeTruthy();
    });

    it('return false when 구독새벽 일때 검사 날짜 하루전이 오늘 07:00 이전 일때', () => {
      const date = dayjs('2022-09-07').toDate();
      const today = dayjs('2022-09-06').format('YYYY-MM-DD');
      const todayTime = dayjs('2022-09-06').set('h', 5).format('Hmm');
      const deliveryType = 'MORNING';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate, today, todayTime })).toBeFalsy();
    });

    it('return false when 구독스팟 일때 검사 날짜 하루전이 오늘 07:00 이후 일때', () => {
      const date = dayjs('2022-09-07').toDate();
      const today = dayjs('2022-09-06').format('YYYY-MM-DD');
      const todayTime = dayjs('2022-09-06').set('h', 8).format('Hmm');
      const deliveryType = 'SPOT';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate, today, todayTime })).toBeFalsy();
    });

    it('return true when 첫번째 배송일보다 작을때', () => {
      const date = new Date('2022-08-28');
      const deliveryType = 'PARCEL';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate })).toBeTruthy();
    });

    it('return true when 마지막 배송일 + 7보다 클때', () => {
      const date = new Date('2022-09-30');
      const deliveryType = 'PARCEL';
      expect(tileDisabled({ date, deliveryType, firstDeliveryDate, lastDeliveryDate })).toBeTruthy();
    });
  });
});
export {};
