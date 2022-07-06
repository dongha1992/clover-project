import { Obj } from '@model/index';

export const DELIVERY_FEE_OBJ: Obj = {
  spot: {
    fee: 0,
    amountForFree: 0,
    minimum: 6000,
  },
  quick: {
    fee: 4000,
    amountForFree: 40000,
    minimum: 10000,
  },
  morning: {
    fee: 3500,
    amountForFree: 35000,
    minimum: 10000,
  },
  parcel: {
    fee: 4000,
    amountForFree: 35000,
    minimum: 10000,
  },
  trialSpot: {
    fee: 4000,
    amountForFree: 40000,
    minimum: 6000,
  },
};

export const INITIAL_NUTRITION = {
  protein: 0,
  calorie: 0,
};

export const INITIAL_DELIVERY_DETAIL = [
  {
    id: 1,
    value: 'LUNCH',
    text: '점심',
    discription: '(오전 9:30까지 주문시 12:00 전 도착)',
    isDisabled: false,
    isSelected: true,
    time: '12시',
  },
  {
    id: 2,
    value: 'DINNER',
    text: '저녁',
    discription: '(오전 11:00까지 주문시 17:00 전 도착)',
    isDisabled: false,
    isSelected: false,
    time: '17시',
  },
];
