import { Obj } from '@model/index';

export const ACCESS_METHOD = [
  {
    id: 1,
    text: '자유출입 가능',
    value: 'FREE',
  },
  {
    id: 2,
    text: '공동현관 비밀번호',
    value: 'COMMON_ENTRANCE_PASSWORD',
  },
  {
    id: 3,
    text: '경비실 호출',
    value: 'CALL_SECURITY_OFFICE',
  },
  {
    id: 4,
    text: '세대 호출',
    value: 'CALL_HOUSE',
  },
  {
    id: 5,
    text: '경비실 배송',
    value: 'DELIVERY_SECURITY_OFFICE',
  },
  {
    id: 6,
    text: '무인택배함 배송 (외부)',
    value: 'DELIVERY_EXTERNAL_UNMANNED_COURIER_BOX',
  },
  {
    id: 8,
    text: '무인택배함 배송 (공동현관 내부)',
    value: 'DELIVERY_INTERNAL_UNMANNED_COURIER_BOX',
  },
  {
    id: 9,
    text: '기타',
    value: 'ETC',
  },
];

export const ACCESS_METHOD_PLACEHOLDER: Obj = {
  FREE: '요청사항을 입력해주세요',
  COMMON_ENTRANCE_PASSWORD: '조합 방식 및 순서(#,호출버튼)와 함께 자세히 입력',
  CALL_SECURITY_OFFICE: '경비실 호출 방법 입력',
  CALL_HOUSE: '새벽에도 호출 가능한 경우 선택해주세요',
  DELIVERY_SECURITY_OFFICE: '경비실 부재 시 공동현관 등에 대응 배송 예정(선택)',
  DELIVERY_EXTERNAL_UNMANNED_COURIER_BOX: '무인택배함 비밀번호 입력',
  DELIVERY_INTERNAL_UNMANNED_COURIER_BOX: ' 공동현관 비밀번호 / 무인택배함 비밀번호 입력',
  ETC: '직접 입력',
};

export const ACCESS_METHOD_VALUE: Obj = {
  FREE: '자유출입 가능',
  COMMON_ENTRANCE_PASSWORD: '공동현관 비밀번호',
  CALL_SECURITY_OFFICE: '경비실 호출',
  CALL_HOUSE: '세대 호출',
  DELIVERY_SECURITY_OFFICE: '경비실 배송',
  DELIVERY_EXTERNAL_UNMANNED_COURIER_BOX: '무인택배함 배송 (외부)',
  DELIVERY_INTERNAL_UNMANNED_COURIER_BOX: '무인택배함 배송 (공동현관 내부)',
  ETC: '기타',
};

export const DELIVERY_TYPE_MAP: Obj = {
  PARCEL: '택배배송',
  MORNING: '새벽배송',
  SPOT: '스팟배송',
  QUICK: '퀵배송',
};

export const DELIVERY_TIME_MAP: Obj = {
  LUNCH: '점심',
  DINNER: '저녁',
};

export const DELIVERY_TIME_MAP2: Obj = {
  저녁: 'DINNER',
  점심: 'LUNCH',
};

export const PAYMENT_METHOD: Obj = {
  NICE_BILLING: '프코페이',
  NICE_CARD: '신용카드',
  NICE_BANK: '계좌이체',
  KAKAO_CARD: '카카오페이',
  PAYCO_EASY: '페이코',
  TOSS_CARD: '토스',
};
