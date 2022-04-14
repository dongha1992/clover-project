import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

interface TProps {
  sbsStartDate: string | null;
  sbsDeliveryTime: string | null;
  sbsOrderMenus: any[] | null;
  sbsDeliveryExpectedDate: string[];
  sbsPickupDay: any[] | null;
}
const initialState: TProps = {
  sbsStartDate: null,
  sbsDeliveryTime: null,
  sbsOrderMenus: [],
  sbsDeliveryExpectedDate: [],
  sbsPickupDay: null,
};

export const subscription = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    SET_SBS_START_DATE: (state, action) => {
      state.sbsStartDate = action.payload.sbsStartDate;
    },
    SET_SBS_DELIVERY_TIME: (state, action) => {
      state.sbsDeliveryTime = action.payload.sbsDeliveryTime;
    },
    SET_SBS_ORDER_MENUS: (state, action: PayloadAction<any>) => {
      state.sbsOrderMenus = action.payload;
    },
    SET_SBS_DELIVERY_EXPECTED_DATE: (state, action) => {
      state.sbsDeliveryExpectedDate = action.payload.sbsDeliveryExpectedDate;
    },
    SET_PICKUP_DAY: (state, action) => {
      state.sbsPickupDay = action.payload.sbsPickupDay;
    },
    SBS_INIT: (state) => {
      state.sbsStartDate = null;
      state.sbsDeliveryTime = null;
      state.sbsOrderMenus = [];
      state.sbsDeliveryExpectedDate = [];
      state.sbsPickupDay = null;
    },
  },
});
export const {
  SET_SBS_START_DATE,
  SET_SBS_DELIVERY_TIME,
  SET_SBS_ORDER_MENUS,
  SET_SBS_DELIVERY_EXPECTED_DATE,
  SET_PICKUP_DAY,
  SBS_INIT,
} = subscription.actions;
export const subscriptionForm = (state: AppState): TProps => state.subscription;
export default subscription.reducer;
