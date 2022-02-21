import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

interface TProps {
  orderType: string;
  isTimerTooltip: boolean;
  deliveryDate: string;
  isInitDelay: boolean;
  orderItemList: any[];
}

const initialState: TProps = {
  orderType: '',
  isTimerTooltip: false,
  isInitDelay: false,
  deliveryDate: '',
  orderItemList: [],
};

export const order = createSlice({
  name: 'order',
  initialState,
  reducers: {
    SET_ORDER_TYPE: (state, action: PayloadAction<any>) => {
      state.orderType = action.payload.orderType;
    },
    SET_TIMER_STATUS: (state, action: PayloadAction<any>) => {
      state.isTimerTooltip = action.payload.isTimerTooltip;
    },
    SET_DELIVERY_DATE: (state, action: PayloadAction<string>) => {
      state.deliveryDate = action.payload;
    },
    INIT_TIMER: (state, action: PayloadAction<any>) => {
      state.isInitDelay = action.payload.isInitDelay;
    },
    // 장바구니에서 결제로 넘어갔을 때
    SET_ORDER_ITEMS: (state, action: PayloadAction<any>) => {
      state.orderItemList = action.payload;
    },
    INIT_ORDER_ITEMS: (state, action: PayloadAction) => {
      state.orderItemList = [];
    },
  },
});
export const { SET_ORDER_TYPE, SET_TIMER_STATUS, SET_DELIVERY_DATE, INIT_TIMER, SET_ORDER_ITEMS } = order.actions;
export const orderForm = (state: AppState): TProps => state.order;
export default order.reducer;
