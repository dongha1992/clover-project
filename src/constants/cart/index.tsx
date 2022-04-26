import { Obj } from '@model/index';

export const DELIVERY_FEE_OBJ: Obj = {
  spot: {
    fee: 0,
    amountForFree: 0,
    minimum: 6000,
  },
  quick: {
    fee: 4000,
    amountForFree: 40000,
    minimum: 10000,
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
    fee: 4000,
    amountForFree: 40000,
    minimum: 6000,
  },
};
