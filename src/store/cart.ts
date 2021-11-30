import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {
  cartLists: any[];
  cartSheetObj: any;
  tempSelectedMenus: any[];
  isFromDeliveryPage: boolean;
};

const initialState: TProps = {
  cartLists: [],
  cartSheetObj: {},
  tempSelectedMenus: [],
  isFromDeliveryPage: false,
};

/* TODO: 로컬 스토리지에 담아야 함 */

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // bottom sheet 눌렀을 때
    SET_CART_SHEET_OBJ: (state, action: PayloadAction<TProps>) => {
      state.cartSheetObj = action.payload;
    },
    // bottom sheet에서 메뉴 선택했을 때
    SET_TEMP_SELECTED_MENUS: (state, action: PayloadAction<TProps>) => {
      state.tempSelectedMenus.push(action.payload);
    },

    // 장바구니 담기 눌렀을 때
    SET_CART_LISTS: (state, action: PayloadAction<any[]>) => {
      state.cartLists.push(...action.payload);
      state.tempSelectedMenus = [];
    },

    SET_AFTER_SETTING_DELIVERY: (state, action: PayloadAction) => {
      state.isFromDeliveryPage = true;
    },

    INIT_AFTER_SETTING_DELIVERY: (state, action: PayloadAction) => {
      state.isFromDeliveryPage = false;
    },
  },
});

export const {
  SET_CART_LISTS,
  SET_CART_SHEET_OBJ,
  SET_TEMP_SELECTED_MENUS,
  SET_AFTER_SETTING_DELIVERY,
  INIT_AFTER_SETTING_DELIVERY,
} = cart.actions;
export const cartForm = (state: AppState): TProps => state.cart;
export default cart.reducer;
