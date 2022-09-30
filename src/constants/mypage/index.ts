import { Obj } from '@model/index';

/* ORDER-DELIERY-HISTORY */

export const DELIVERY_STATUS_MAP: Obj = {
  COMPLETED: '배송완료',
  CANCELED: '주문취소',
  RESERVED: '주문완료',
  DELIVERING: '배송중',
  PREPARING: '상품준비 중',
};

export const DIB_MENU = [
  { id: 1, text: '일반 상품', link: '/mypage/dib/general', value: 'general' },
  {
    id: 2,
    text: '구독 상품',
    link: '/mypage/dib/subscription',
    value: 'subscription',
  },
];

export const SPOT_MENU = [
  {
    id: 1, text: '신청 현황', link: '/mypage/spot/status', value: 'status'
  },
  {
    id: 2, text: '찜한 프코스팟', link: '/mypage/spot/wish', value: 'wish'
  }
];

export const REVIEW_MENU = [
  {
    id: 1, text: '작성 예정', link: '/mypage/review/schedule', value: 'schedule'
  },
  {
    id: 2, text: '작성 완료', link: '/mypage/review/completed', value: 'completed'
  }
];

export const ADDRESS_MENU = [
  {
    id: 1, text: '픽업', link: '/mypage/address/pickup', value: 'pickup'
  },
  {
    id: 2, text: '배송', link: '/mypage/address/delivery', value: 'delivery'
  }
]

export const SECESSION_REASON = [
  { id: 0, text: '탈퇴 후 재가입을 하기 위해서' },
  { id: 1, text: '서비스 이용 계획이 없어서' },
  { id: 2, text: '제품의 만족도가 낮아서' },
  { id: 3, text: '배송 서비스 만족도가 낮아서' },
  { id: 4, text: '고객지원 만족도가 낮아서' },
  { id: 5, text: '주문, 검색 등 서비스 사용이 불편해서' },
  { id: 6, text: '기타' },
];

export const SECESSION_EXPLAIN = [
  '회원탈퇴 시 회원전용 서비스 이용이 불가합니다.',
  '거래정보가 있는 경우, 소비자 보호에 관한 법률에 따라 계약, 결제, 재화 등의 기록은 5년간 보존됩니다.',
  '상품문의 및 후기는 자동으로 삭제되지 않으며 삭제를 원하시는 경우 삭제 및 수정 후 탈퇴를 진행해야 합니다.',
  '남은 쿠폰, 포인트는 소멸되며 복구가 불가합니다.',
];
