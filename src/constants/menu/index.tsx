import { Obj } from '@model/index';

export const IMAGE_ERROR = 'https://s3.ap-northeast-2.amazonaws.com/freshcode-clover/dev/menu/img_thumbnail_empty.jpg';

export const MENU_DETAIL_INFORMATION = [
  {
    text: '상품 정보',
    link: '/menu/[menuId]/detail/product',
    value: 'product',
  },
  {
    text: '영양 정보',
    link: '/menu/[menuId]/detail/nutrition',
    value: 'nutrition',
  },
  {
    text: '배송 정보',
    link: '/menu/[menuId]/detail/delivery',
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

export const TAG_MAP: Obj = {
  VEGETARIAN: '채식',
  VEGAN: '비건',
  FRUITARIAN: '프루테리언',
  POLLO_PESCO_VEGETARIAN: '폴로페스코',
  POLLO_VEGETARIAN: '폴로베지테리언',
  PESCO_VEGETARIAN: '페스코베지테리언',
  LACTO_OVO_VEGETARIAN: '락토오보베지테리언',
  LACTO_VEGETARIAN: '락토베지테리언',
  OVO_VEGETARIAN: '오보베지테리언',
  FLEXITARIAN: '플렉시테리언',
};
export const COUPON_LIST = [
  {
    id: 1,
    discount: 20,
    name: '따끈따끈 15% 할인 쿠폰',
    canUseMenu: ['[도레도레] 마들렌 세트', '[도레도레] 마들렌 세트'],
    expireDate: ['2021-11-07'],
    type: 'rate',
    isDownload: false,
    deliveryMethod: '전체',
  },
  {
    id: 2,
    discount: 2000,
    name: '2,000원 할인 쿠폰',
    canUseMenu: ['[도레도레] 마들렌 세트', '[도레도레] 마들렌 세트', '[도레도레] 마들렌 세트'],
    condition: '30,000원 이상 주문 시',
    expireDate: ['2021-11-07'],
    type: 'fixed',
    isDownload: true,
    deliveryMethod: '새벽배송 / 정기구독',
  },
  {
    id: 3,
    discount: 10,
    name: '10% 할인',
    condition: '30,000원 이상 주문 시',
    expireDate: ['2021-11-07'],
    type: 'rate',
    isDownload: false,
    canUseMenu: ['[도레도레] 마들렌 세트'],
  },
];

export const CATEGORY_TITLE_MAP: Obj = {
  all: '전체메뉴',
  salad: '샐러드',
  wrap: '랩·샌드위치',
  meal: '도시락·간편식',
  set: '세트상품',
  snack: '간식',
  soup: '죽·스프',
  drink: '음료',
};
