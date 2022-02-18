import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {
  cartLists: any[];
  cartSheetObj: any;
  isFromDeliveryPage: boolean;
};

const initialState: TProps = {
  cartLists: [],
  cartSheetObj: {},
  isFromDeliveryPage: false,
};

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // bottom sheet 눌렀을 때
    SET_CART_SHEET_OBJ: (state, action: PayloadAction<TProps>) => {
      state.cartSheetObj = action.payload;
    },

    // 장바구니 담기 눌렀을 때
    SET_CART_LISTS: (state, action: PayloadAction<any[]>) => {
      state.cartLists.push(...action.payload);
    },

    SET_AFTER_SETTING_DELIVERY: (state, action: PayloadAction) => {
      state.isFromDeliveryPage = true;
    },

    INIT_AFTER_SETTING_DELIVERY: (state, action: PayloadAction) => {
      state.isFromDeliveryPage = false;
    },
    REMOVE_CART_ITEM: (state, { payload }: PayloadAction<number>) => {
      // const newState = state.tempSelectedMenus.filter(
      //   (item) => item.id !== payload
      // );
    },
  },
});

export const {
  SET_CART_LISTS,
  SET_CART_SHEET_OBJ,
  SET_AFTER_SETTING_DELIVERY,
  INIT_AFTER_SETTING_DELIVERY,
  REMOVE_CART_ITEM,
} = cart.actions;
export const cartForm = (state: AppState): TProps => state.cart;
export default cart.reducer;
