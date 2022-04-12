import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IOrderPreviewRequest } from '@model/index';

interface TProps {
  orderType: string;
  isTimerTooltip: boolean;
  deliveryDate: string;
  isInitDelay: boolean;
  tempOrder: IOrderPreviewRequest | null;
}

const initialState: TProps = {
  orderType: '',
  isTimerTooltip: false,
  isInitDelay: false,
  deliveryDate: '',
  tempOrder: null,
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

    INIT_TIMER: (state, action: PayloadAction<any>) => {
      state.isInitDelay = action.payload.isInitDelay;
    },

    SET_ORDER: (state, action: PayloadAction<IOrderPreviewRequest | null>) => {
      state.tempOrder = action.payload;
    },

    INIT_ORDER: (state, action: PayloadAction) => {
      state.tempOrder = null;
    },
  },
});
export const { SET_ORDER_TYPE, SET_TIMER_STATUS, INIT_TIMER, SET_ORDER } = order.actions;
export const orderForm = (state: AppState): TProps => state.order;
export default order.reducer;
