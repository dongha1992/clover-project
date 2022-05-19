import { IMenuTableItems, IMenuTable, ISubscribeInfo } from '@model/index';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

interface TProps {
  subsStartDate: string | null;
  subsOrderMenus: any[] | null;
  subsDeliveryExpectedDate: any;
  subsCalendarSelectMenu: IMenuTable | null;
  subsInfo: ISubscribeInfo | null;
}

const initialState: TProps = {
  subsStartDate: null,
  subsOrderMenus: [],
  subsCalendarSelectMenu: null,
  subsDeliveryExpectedDate: null,
  subsInfo: {
    deliveryType: null,
    deliveryTime: null,
    pickup: null,
    period: null,
    startDate: null,
    deliveryDay: null,
  },
};

export const subscription = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    SET_SUBS_START_DATE: (state, action) => {
      state.subsStartDate = action.payload.subsStartDate;
    },
    SET_SUBS_ORDER_MENUS: (state, action: PayloadAction<any>) => {
      state.subsOrderMenus = action.payload;
    },
    SET_SUBS_CALENDAR_SELECT_MENU: (state, action) => {
      state.subsCalendarSelectMenu = action.payload;
    },
    SET_SUBS_DELIVERY_EXPECTED_DATE: (state, action) => {
      state.subsDeliveryExpectedDate = action.payload.subsDeliveryExpectedDate;
    },
    SET_SUBS_INFO_STATE: (state, action) => {
      state.subsInfo = { ...state.subsInfo, ...action.payload };
    },
    SET_SUBS_INFO: (state, action) => {
      state.subsInfo = action.payload.subsInfo;
    },
    SUBS_INIT: (state) => {
      state.subsStartDate = null;
      state.subsOrderMenus = [];
      state.subsDeliveryExpectedDate = null;
    },
  },
});
export const {
  SET_SUBS_START_DATE,
  SET_SUBS_ORDER_MENUS,
  SET_SUBS_DELIVERY_EXPECTED_DATE,
  SET_SUBS_CALENDAR_SELECT_MENU,
  SET_SUBS_INFO_STATE,
  SUBS_INIT,
} = subscription.actions;
export const subscriptionForm = (state: AppState): TProps => state.subscription;
export default subscription.reducer;
