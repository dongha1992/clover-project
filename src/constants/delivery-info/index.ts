import { Obj } from '@model/index';

export const DELIVERY_METHOD: any = {
  pickup: [
    {
      id: 1,
      value: 'spot',
      name: '스팟배송',
      tag: '무료배송',
      description: '- 수도권 내 오픈된 프코스팟으로 픽업 가능',
      feeInfo: '- 언제나 배송비 무료ㅣ점심 · 저녁픽업',
    },
  ],
  delivery: [
    {
      id: 2,
      value: 'morning',
      name: '새벽배송',
      tag: '',
      description: '- 서울 전체, 경기/인천 일부 지역 이용 가능',
      feeInfo: '- 배송비 3,500원 (3만 5천 원 이상 배송비 무료)',
    },
    {
      id: 3,
      value: 'parcel',
      name: '택배배송',
      tag: '',
      description: '- 전국 어디서나 이용 가능 (제주, 도서 산간지역 제외)',
      feeInfo: '- 배송비 3,500원 (3만 5천 원 이상 배송비 무료)',
    },
    {
      id: 4,
      value: 'quick',
      name: '퀵배송',
      tag: '',
      description: '- 서울 전 지역 이용 가능',
      feeInfo: '- 배송비 4,000원 (4만 원 이상 배송비 무료) | 점심, 저녁배송',
    },
  ],
};

export const weeks: Obj = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
};
