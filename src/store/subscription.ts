import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

interface TProps {
  subsStartDate: string | null;
  subsDeliveryTime: string | null;
  subsOrderMenus: any[] | null;
  subsDeliveryExpectedDate: any;
  subsPickupDay: any[] | null;
}
const initialState: TProps = {
  subsStartDate: null,
  subsDeliveryTime: null,
  subsOrderMenus: [],
  subsDeliveryExpectedDate: null,
  subsPickupDay: null,
};

export const subscription = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    SET_SUBS_START_DATE: (state, action) => {
      state.subsStartDate = action.payload.subsStartDate;
    },
    SET_SUBS_DELIVERY_TIME: (state, action) => {
      state.subsDeliveryTime = action.payload.subsDeliveryTime;
    },
    SET_SUBS_ORDER_MENUS: (state, action: PayloadAction<any>) => {
      state.subsOrderMenus = action.payload;
    },
    SET_SUBS_DELIVERY_EXPECTED_DATE: (state, action) => {
      state.subsDeliveryExpectedDate = action.payload.subsDeliveryExpectedDate;
    },
    SET_PICKUP_DAY: (state, action) => {
      state.subsPickupDay = action.payload.subsPickupDay;
    },
    SUBS_INIT: (state) => {
      state.subsStartDate = null;
      state.subsDeliveryTime = null;
      state.subsOrderMenus = [];
      state.subsDeliveryExpectedDate = null;
      state.subsPickupDay = null;
    },
  },
});
export const {
  SET_SUBS_START_DATE,
  SET_SUBS_DELIVERY_TIME,
  SET_SUBS_ORDER_MENUS,
  SET_SUBS_DELIVERY_EXPECTED_DATE,
  SET_PICKUP_DAY,
  SUBS_INIT,
} = subscription.actions;
export const subscriptionForm = (state: AppState): TProps => state.subscription;
export default subscription.reducer;
