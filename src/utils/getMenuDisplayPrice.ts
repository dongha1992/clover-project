import { pipe, map, sortBy, take, toArray } from '@fxts/core';

interface IResult {
  discount: number;
  discountedPrice: number;
  price: number;
}

export const getMenuDisplayPrice = (menuDetails: any): IResult => {
  /* TODO: 케이스 추가 */

  // if (!menuDetails) return null;

  const [result]: any = pipe(
    menuDetails,
    map((item: any) => {
      return getDiscountPrice({ discountPrice: item.discountPrice, price: item.price });
    }),
    sortBy((item) => item.price),
    take(1),
    toArray
  );

  return result;
};

export const getDiscountPrice = ({ discountPrice, price }: { discountPrice: number; price: number }): IResult => {
  return {
    discount: Math.floor((discountPrice / price) * 100),
    discountedPrice: price - discountPrice,
    price: price,
  };
};
