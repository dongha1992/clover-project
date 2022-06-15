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

export const PERIOD_NUMBER: Obj = {
  ONE_WEEK: '1',
  TWO_WEEK: '2',
  THREE_WEEK: '3',
  FOUR_WEEK: '4',
  FIVE_WEEK: '5',
  SIX_WEEK: '6',
  SEVEN_WEEK: '7',
};

export const SUBS_STATUS: Obj = {
  UNPAID: '구독예정',
  RESERVED: '구독예정',
  PROGRESS: '구독 중',
  COMPLETED: '구독완료',
  CANCELED: '구독취소',
};

export const SUBS_DELIVERY_STATUS: Obj = {
  RESERVED: '주문완료',
  PREPARING: '상품준비 중',
  DELIVERING: '배송 중',
  COMPLETED: '배송완료',
  CANCELED: '구독취소',
};
export const SUBS_DELIVERY_UNPAID_STATUS: Obj = {
  RESERVED: '구독예정',
  PREPARING: '상품준비 중',
  DELIVERING: '배송 중',
  COMPLETED: '배송완료',
  CANCELED: '구독취소',
};
