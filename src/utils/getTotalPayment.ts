export interface ITotalPayment {
  menuAmount: number;
  menuDiscount: number;
  eventDiscount: number;
  deliveryFeeDiscount: number;
  coupon: number;
  point: number;
  optionAmount: number;
  optionQuantity: number;
  deliveryFee: number;
}
export const getTotalPayment = ({
  menuAmount,
  menuDiscount,
  eventDiscount,
  deliveryFeeDiscount,
  coupon,
  point,
  optionAmount,
  optionQuantity,
  deliveryFee,
}: ITotalPayment): number => {
  return (
    menuAmount -
    (menuDiscount + eventDiscount + deliveryFeeDiscount + coupon + point) +
    optionAmount * optionQuantity +
    deliveryFee
  );
};
