export const MUTILPLE_CHECKBOX_MENU = [
  { name: '전체', value: 'ALL', filtered: false, fieldName: '' },
  { name: '비건', value: 'VEGAN', filtered: false, fieldName: '' },
  { name: '해산물', value: 'SEAFOOD', filtered: false, fieldName: '' },
  { name: '육류', value: 'MEAT', filtered: false, fieldName: '' },
  { name: '유제품', value: 'DAIRY_PRODUCTS', filtered: false, fieldName: '' },
];

export const RADIO_CHECKBOX_MENU = [
  { id: 0, text: '추천 순', value: '' },
  { id: 1, text: '구매수 순', value: 'ORDER_COUNT_DESC' },
  { id: 2, text: '신제품 순', value: 'LAUNCHED_DESC' },
  { id: 3, text: '가격 낮은 순', value: 'PRICE_ASC' },
  { id: 4, text: '가격 높은 순', value: 'PRICE_DESC' },
  { id: 5, text: '리뷰수 순', value: 'REVIEW_COUNT_DESC' },
];

export const RADIO_CHECKBOX_SPOT = [
  { id: 1, text: '가까운 순', value: 'nearest' },
  { id: 2, text: '정확도 순', value: 'frequency' },
  { id: 3, text: '이용자 순', value: 'user' },
];

export const ORDER_DATE_RADIO_CHECKBOX = [
  { id: 1, text: '최근 3개월', value: '90' },
  { id: 2, text: '최근 6개월', value: '180' },
  { id: 3, text: '최근 1년', value: '365' },
];
