import { pipe, map, sortBy, take, toArray } from '@fxts/core';

export const getMenuDisplayPrice = (
  menuDetails: any[]
): {
  discount: number;
  discountedPrice: number;
  price: number;
} => {
  /* TODO: 케이스 추가 */

  // if (!menuDetails) return null;

  const [result] = pipe(
    menuDetails,
    map((item) => {
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
