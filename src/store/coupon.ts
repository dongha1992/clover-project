import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { ICoupon } from '@model/index';

interface TState {
  selectedCoupon: ICoupon | null;
  prevValue: number;
}

const initialState: TState = {
  selectedCoupon: null,
  prevValue: 0,
};

export const coupon = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    SET_USER_SELECT_COUPON: (state: any, action: PayloadAction<ICoupon>) => {
      state.selectedCoupon = action.payload;
    },
    SET_PREVIOUS_SELECT_COUPON: (state: any, action: PayloadAction<number>) => {
      state.prevValue = action.payload;
    },
    INIT_COUPON: (state: any) => {
      state.selectedCoupon = null;
    },
    INIT_PREV_SELECT_COUPON: (state: any) => {
      state.prevValue = 0;
    },
  },
});
export const { SET_USER_SELECT_COUPON, INIT_COUPON, SET_PREVIOUS_SELECT_COUPON, INIT_PREV_SELECT_COUPON } =
  coupon.actions;
export const couponForm = (state: AppState): TState => state.coupon;
export default coupon.reducer;
