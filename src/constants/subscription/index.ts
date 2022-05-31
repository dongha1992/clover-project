import { Obj } from '@model/index';

export const SUBSCRIPTION_PERIOD = [
  {
    id: 1,
    period: 'ONE_WEEK',
    text: '1주 (3% 할인)',
  },
  {
    id: 2,
    period: 'TWO_WEEK',
    text: '2주 (3% 할인)',
  },
  {
    id: 3,
    period: 'THREE_WEEK',
    text: '3주 (5% 할인)',
  },
  {
    id: 4,
    period: 'FOUR_WEEK',
    text: '4주 (5% 할인)',
  },
  {
    id: 5,
    period: 'UNLIMITED',
    text: '정기구독 (최대 15% 할인)',
  },
];

export const SUBSCRIBE_TIME_SELECT = [
  {
    id: 1,
    type: '점심',
    text: '(8시까지 주문 시 12시 전 도착)',
  },
  {
    id: 2,
    type: '저녁',
    text: '(8시까지 주문 시 17시 전 도착)',
  },
];

export const periodMapper: Obj = {
  ONE_WEEK: '1주',
  TWO_WEEK: '2주',
  THREE_WEEK: '3주',
  FOUR_WEEK: '4주',
  UNLIMITED: '정기구독',
};

export const deliveryDetailMapper1: Obj = {
  저녁: 'DINNER',
  점심: 'LUNCH',
};

export const deliveryDetailMapper2: Obj = {
  DINNER: '저녁',
  LUNCH: '점심',
};
