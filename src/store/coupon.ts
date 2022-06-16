import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { ICoupon } from '@model/index';

interface TState {
  selectedCoupon: ICoupon | null;
}

const initialState: TState = {
  selectedCoupon: null,
};

export const coupon = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    SET_USER_SELECT_COUPON: (state: any, action: PayloadAction<ICoupon>) => {
      state.selectedCoupon = action.payload;
    },
    INIT_COUPON: (state: any) => {
      state.selectedCoupon = null;
    },
  },
});
export const { SET_USER_SELECT_COUPON, INIT_COUPON } = coupon.actions;
export const couponForm = (state: AppState): TState => state.coupon;
export default coupon.reducer;
