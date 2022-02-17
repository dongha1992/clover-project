export const MANAGE_MENU = [
  { id: 1, text: '구독 관리', link: '/mypage/subscrition' },
  { id: 2, text: '스팟 관리', link: '/mypage/spot' },
  { id: 3, text: '후기 관리', link: '/mypage/review' },
  { id: 4, text: '찜 관리', link: '/mypage/dib' },
  { id: 5, text: '친구 초대', link: '/mypage/friend' },
  { id: 6, text: '주소 관리', link: '/mypage/address' },
  { id: 7, text: '결제 관리', link: '/mypage/payment' },
  { id: 8, text: '이벤트', link: '/mypage/event' },
  { id: 9, text: '배송안내', link: '/mypage/deliver-infomation' },
  { id: 10, text: '고객센터', link: '/mypage/customer-service' },
  { id: 11, text: '약관 및 정책', link: '/mypage/term' },
];

export const DIB_MENU = [
  { id: 1, text: '일반 상품', link: '/mypage/dib/general', value: 'general' },
  {
    id: 2,
    text: '구독 상품',
    link: '/mypage/dib/subscription',
    value: 'subscription',
  },
];

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
