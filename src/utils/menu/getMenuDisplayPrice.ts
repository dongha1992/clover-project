import { pipe, map, sortBy, take, toArray } from '@fxts/core';
import { IMenuDetails } from '@model/index';

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
  // if (!menuDetails) return;

  const [result]: any = pipe(
    menuDetails,
    map((item: any) => {
      return {
        discount: Math.floor((item.discountPrice / item.price) * 100) || 0,
        discountedPrice: item.price - item.discountPrice || 0,
        price: item.price || 0,
      };
    }),
    sortBy((item) => item.price),
    take(1)
  );

  return result;
};

const getMenuOptionPrice = (item: IMenuDetails) => {
  const price = item.price;
  const discount = Math.floor((item.discountPrice / item.price) * 100);
  const discountedPrice = item.price - item.discountPrice;
  return { price, discount, discountedPrice };
};

const getDiscountPrice = ({ discountPrice, price }: { discountPrice: number; price: number }): IResult => {
  return {
    discount: Math.floor((discountPrice / price) * 100),
    discountedPrice: price - discountPrice,
    price: price,
  };
};

export { getMenuDisplayPrice, getDiscountPrice, getMenuOptionPrice };
