import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

interface TProps {
  sbsStartDate: string | null;
  sbsDeliveryTime: string | null;
  sbsDeliveryExpectedDate: string[] | null;
  sbsPickupDay: any[] | null;
}
const initialState: TProps = {
  sbsDeliveryTime: null,
  sbsStartDate: null,
  sbsDeliveryExpectedDate: null,
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
    SET_SBS_DELIVERY_EXPECTED_DATE: (state, action) => {
      state.sbsDeliveryExpectedDate = action.payload.sbsDeliveryExpectedDate;
    },
    SET_PICKUP_DAY: (state, action) => {
      state.sbsPickupDay = action.payload.sbsPickupDay;
    },
  },
});
export const { SET_SBS_START_DATE, SET_SBS_DELIVERY_EXPECTED_DATE, SET_SBS_DELIVERY_TIME, SET_PICKUP_DAY } =
  subscription.actions;
export const subscriptionForm = (state: AppState): TProps => state.subscription;
export default subscription.reducer;
