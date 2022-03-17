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
    text: '무인택배함 배송 (외부) ',
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

export const ACCESS_METHOD_MAP: Obj = {
  FREE: '요청사항을 입력해주세요',
  COMMON_ENTRANCE_PASSWORD: '예) #1234#',
  CALL_SECURITY_OFFICE: '경비실 호출 방법 입력',
  CALL_HOUSE: '새벽에도 호출 가능한 경우 선택해주세요',
  DELIVERY_SECURITY_OFFICE: '경비실 부재 시 공동현관 등에 대응 배송 예정(선택)',
  DELIVERY_EXTERNAL_UNMANNED_COURIER_BOX: '무인택배함 비밀번호 입력',
  DELIVERY_INTERNAL_UNMANNED_COURIER_BOX: ' 공동현관 비밀번호 / 무인택배함 비밀번호 입력',
  ETC: '직접 입력',
};

export const DELIVERY_TYPE_MAP: Obj = {
  PARCEL: '택배배송',
  MORNING: '새벽배송',
  SPOT: '스팟배송',
  QUICK: '퀵배송',
};
