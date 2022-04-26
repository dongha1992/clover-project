interface IDeliveryObj {
  spot: {
    fee: number;
    amountForFree: number;
    minimum: number;
  };
  quick: {
    fee: number;
    amountForFree: number;
    minimum: number;
  };
  morning: {
    fee: number;
    amountForFree: number;
    minimum: number;
  };
  parcel: {
    fee: number;
    amountForFree: number;
    minimum: number;
  };
  trialSpot?: {
    fee: number;
    amountForFree: number;
    minimum: number;
  };
}

// // 배송비
// deliveryFeeObj: {
//   spot: 0,
//   trialSpot: 4000,
//   quick: 4000,
//   morning: 3500,
//   parcel: 3500
// },
// // 배송비 무료 금액
// freeDeliveryAmountObj: {
//   spot: 0,
//   trialSpot: 40000,
//   quick: 40000,
//   morning: 35000,
//   parcel: 35000
// },
// // 최소주문금액
// minOrderAmountObj: {
//   spot: 6000,
//   trialSpot: 6000,
//   quick: 10000,
//   morning: 10000,
//   parcel: 10000
// }

export const DELIVERY_FEE_OBJ: IDeliveryObj = {
  spot: {
    fee: 0,
    amountForFree: 0,
    minimum: 6000,
  },
  quick: {
    fee: 4000,
    amountForFree: 40000,
    minimum: 40000,
  },
  morning: {
    fee: 3500,
    amountForFree: 35000,
    minimum: 10000,
  },
  parcel: {
    fee: 4000,
    amountForFree: 35000,
    minimum: 10000,
  },
  trialSpot: {
    fee: 400,
    amountForFree: 40000,
    minimum: 6000,
  },
};
