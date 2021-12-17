export const MENU_DETAIL_INFORMATION = [
  {
    text: '상품 정보',
    link: '/menu/detail/product',
    value: 'product',
  },
  {
    text: '영양 정보',
    link: '/menu/detail/nutrition',
    value: 'nutrition',
  },
  {
    text: '배송 정보',
    link: '/menu/detail/delivery',
    value: 'delivery',
  },
];

export const MENU_REVIEW_AND_FAQ = [
  {
    text: '상세 정보',
    link: '/menu/[id]',
    value: 'info',
  },
  {
    text: '후기',
    link: '/menu/detail/review',
    value: 'review',
  },
  {
    text: 'FAQ',
    link: '/menu/detail/faq',
    value: 'faq',
  },
];

export const COUPON_LIST = [
  {
    id: 1,
    discount: 20,
    name: '따끈따끈 15% 할인 쿠폰',
    canUseMenu: ['[도레도레] 마들렌 세트', '[도레도레] 마들렌 세트'],
    expireDate: ['2021-11-07'],
    type: 'rate',
    isDownload: false,
  },
  {
    id: 2,
    discount: 2000,
    name: '2,000원 할인 쿠폰',
    canUseMenu: [
      '[도레도레] 마들렌 세트',
      '[도레도레] 마들렌 세트',
      '[도레도레] 마들렌 세트',
    ],
    condition: '30,000원 이상 주문 시',
    expireDate: ['2021-11-07'],
    type: 'fixed',
    isDownload: true,
  },
  {
    id: 3,
    discount: 10,
    name: '10% 할인',
    condition: '30,000원 이상 주문 시',
    expireDate: ['2021-11-07'],
    type: 'rate',
    isDownload: false,
  },
];
