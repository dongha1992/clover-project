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
}

const initialState: TProps = {
  orderType: '',
  isTimerTooltip: false,
  isInitDelay: false,
  deliveryDate: '',
  tempOrder: null,
  selectedCard: null,
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

    SET_CARD: (state, action: PayloadAction<number | null>) => {
      state.selectedCard = action.payload;
    },
    INIT_CARD: (state, action: PayloadAction) => {
      state.selectedCard = null;
    },
  },
});
export const { SET_ORDER_TYPE, SET_TIMER_STATUS, INIT_TIMER, SET_ORDER, SET_CARD, INIT_CARD, INIT_ORDER } =
  order.actions;
export const orderForm = (state: AppState): TProps => state.order;
export default order.reducer;
