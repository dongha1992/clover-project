import { pipe, map, sortBy, take, toArray } from '@fxts/core';

interface IPriceResult {
  discount: number;
  discountedPrice: number;
  price: number;
}

export const getMenuDisplayPrice = (menuDetails: any): IPriceResult => {
  /* TODO: 케이스 추가 */

  // if (!menuDetails) return null;

  const [result]: any = pipe(
    menuDetails,
    map((item: any) => {
      return {
        discount: Math.floor((item.discountPrice / item.price) * 100),
        discountedPrice: item.price - item.discountPrice,
        price: item.price,
      };
    }),
    sortBy((item) => item.price),
    take(1),
    toArray
  );

  return result;
};
