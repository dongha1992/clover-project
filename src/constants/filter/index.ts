/* TODO: 확장성 고려 못하고 변수명 지음 */

export const MUTILPLE_CHECKBOX_MENU = [
  { id: 1, text: '전체', value: 'all' },
  { id: 2, text: '비건', value: 'vegan' },
  { id: 3, text: '해산물', value: 'fish' },
  { id: 4, text: '육류', value: 'meat' },
  { id: 5, text: '유제품', value: 'milk' },
];

export const RADIO_CHECKBOX_MENU = [
  { id: 1, text: '구매수 순', value: 'buy' },
  { id: 2, text: '신제품 순', value: 'new' },
  { id: 3, text: '가격 낮은 순', value: 'lowPrice' },
  { id: 4, text: '가격 높은 순', value: 'highPrice' },
  { id: 5, text: '리뷰수 순', value: 'review' },
];

export const MUTILPLE_CHECKBOX_SPOT = {
  public: [
    { id: 1, text: '일반서점', value: 'STORE' },
    { id: 2, text: 'GS25', value: 'GS25' },
    { id: 3, text: '서점', value: 'BOOKSTORE' },
    { id: 4, text: '스토리웨이', value: 'STORYWAY' },
    { id: 5, text: '커페', value: 'CAFE' },
    { id: 6, text: '세븐일레븐', value: 'SEVEN_ELEVEN' },
    { id: 7, text: '피트니스', value: 'FITNESS_CENTER' },
    { id: 8, text: '약국', value: 'DRUGSTORE' },

  ],
  etc: [
    { id: 9, text: '취식가능', value: 'test' },
    { id: 10, text: '주차가능', value: 'new' },
    { id: 11, text: '저녁픽업가능', value: 'lowPrice' },
    { id: 12, text: '할인 진행 중', value: 'highPrice' },
  ],
};

export const RADIO_CHECKBOX_SPOT = [
  { id: 1, text: '가까운 순', value: 'nearest' },
  { id: 2, text: '정확도 순', value: 'frequency' },
  { id: 3, text: '이용자 순', value: 'frequency' },
];

export const ORDER_DATE_RADIO_CHECKBOX = [
  { id: 1, text: '최근 3개월', value: 'threeMonth' },
  { id: 2, text: '최근 6개월', value: 'sixMonth' },
  { id: 3, text: '최근 1년', value: 'oneYear' },
];
