import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

interface TProps {
  orderType: string;
};

const initialState: TProps = {
  orderType: ''
}

export const order = createSlice({
  name: 'order',
  initialState,
  reducers: {
    SET_ORDER_TYPE: (state, action: PayloadAction<TProps>) => {
      state.orderType = action.payload.orderType
    }
  }
})
export const { SET_ORDER_TYPE } = order.actions
export const orderForm = (state: AppState): TProps => state.order;
export default order.reducer;