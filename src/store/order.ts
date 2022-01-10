import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

interface TProps {
  orderType: string;
  timerTooltip: Boolean;
};

const initialState: TProps = {
  orderType: '',
  timerTooltip: false
}

export const order = createSlice({
  name: 'order',
  initialState,
  reducers: {
    SET_ORDER_TYPE: (state, action: PayloadAction<any>) => {
      state.orderType = action.payload.orderType
    },
    SET_TIMER_STATUS: (state, action: PayloadAction<any>) => {
      state.timerTooltip = action.payload.timerTooltip
    }
  }
})
export const { SET_ORDER_TYPE, SET_TIMER_STATUS } = order.actions
export const orderForm = (state: AppState): TProps => state.order;
export default order.reducer;