import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { ICoupon } from '@pages/mypage/coupon';

interface TState {
  selectedCoupon: ICoupon;
}

const initialState: TState = {
  selectedCoupon: {
    id: 0,
    discount: 0,
    name: '',
    condition: '',
    expireDate: [],
    type: '',
    isDownload: false,
    canUseMenu: [],
  },
};

export const coupon = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    SET_USER_SELECT_COUPON: (state, action: PayloadAction<ICoupon>) => {
      state.selectedCoupon = action.payload;
    },
  },
});
export const { SET_USER_SELECT_COUPON } = coupon.actions;
export const couponForm = (state: AppState): TState => state.coupon;
export default coupon.reducer;
