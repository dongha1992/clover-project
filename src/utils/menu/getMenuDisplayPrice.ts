import { pipe, map, sortBy, take, toArray } from '@fxts/core';

interface IResult {
  discount: number;
  discountedPrice: number;
  price: number;
}
interface IPriceResult {
  discount: number;
  discountedPrice: number;
  price: number;
}

const getMenuDisplayPrice = (menuDetails: any): IPriceResult => {
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
    take(1)
  );

  return result;
};

const getDiscountPrice = ({ discountPrice, price }: { discountPrice: number; price: number }): IResult => {
  return {
    discount: Math.floor((discountPrice / price) * 100),
    discountedPrice: price - discountPrice,
    price: price,
  };
};

export { getMenuDisplayPrice, getDiscountPrice };
