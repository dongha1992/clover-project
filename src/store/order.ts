import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IOrderPreviewRequest } from '@model/index';

interface TProps {
  orderType: string;
  isTimerTooltip: boolean;
  deliveryDate: string;
  isInitDelay: boolean;
  tempOrder: IOrderPreviewRequest | null;
  selectedCard: number | null;
  recentPayment: string;
}

const initialState: TProps = {
  orderType: '',
  isTimerTooltip: false,
  isInitDelay: false,
  deliveryDate: '',
  tempOrder: null,
  selectedCard: null,
  recentPayment: '',
};

export const order = createSlice({
  name: 'order',
  initialState,
  reducers: {
    SET_ORDER_TYPE: (state: any, action: PayloadAction<any>) => {
      state.orderType = action.payload.orderType;
    },

    SET_TIMER_STATUS: (state: any, action: PayloadAction<any>) => {
      state.isTimerTooltip = action.payload.isTimerTooltip;
    },

    INIT_TIMER: (state: any, action: PayloadAction<any>) => {
      state.isInitDelay = action.payload.isInitDelay;
    },

    SET_ORDER: (state: any, action: PayloadAction<IOrderPreviewRequest | null>) => {
      state.tempOrder = action.payload;
    },

    INIT_ORDER: (state: any, action: PayloadAction) => {
      state.tempOrder = null;
    },

    SET_CARD: (state: any, action: PayloadAction<number | null>) => {
      state.selectedCard = action.payload;
    },
    INIT_CARD: (state: any, action: PayloadAction) => {
      state.selectedCard = null;
    },
    SET_RECENT_PAYMENT: (state: any, action: PayloadAction<string>) => {
      state.recentPayment = action.payload;
    },
  },
});
export const {
  SET_ORDER_TYPE,
  SET_TIMER_STATUS,
  INIT_TIMER,
  SET_ORDER,
  SET_CARD,
  INIT_CARD,
  INIT_ORDER,
  SET_RECENT_PAYMENT,
} = order.actions;
export const orderForm = (state: AppState): TProps => state.order;
export default order.reducer;
