import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IOrderPreviewRequest } from '@model/index';

interface IUserOrderInfo {}
interface TProps {
  orderType: string;
  isTimerTooltip: boolean;
  deliveryDate: string;
  isInitDelay: boolean;
  tempOrder: IOrderPreviewRequest | null;
  selectedCard: number | null;
  recentPayment: string;
  userOrderInfo: any;
}

const initialState: TProps = {
  orderType: '',
  isTimerTooltip: false,
  isInitDelay: false,
  deliveryDate: '',
  tempOrder: null,
  selectedCard: null,
  recentPayment: '',
  userOrderInfo: null,
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
    SET_USER_ORDER_INFO: (state: any, action: PayloadAction<IUserOrderInfo>) => {
      console.log(action.payload, '@@');
      state.userOrderInfo = action.payload;
    },
    INIT_USER_ORDER_INFO: (state: any, action: PayloadAction) => {
      state.userOrderInfo = null;
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
  SET_USER_ORDER_INFO,
  INIT_USER_ORDER_INFO,
} = order.actions;
export const orderForm = (state: AppState): TProps => state.order;
export default order.reducer;
