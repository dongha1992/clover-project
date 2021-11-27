import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {
  cartLists: any[];
  cartModalObj: any;
  tempSelectedMenus: any[];
};

const initialState: TProps = {
  cartLists: [],
  cartModalObj: {},
  tempSelectedMenus: [],
};

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // modal 눌렀을 때
    setCartModalObj: (state, action: PayloadAction<TProps>) => {
      state.cartModalObj = action.payload;
    },
    // modal에서 메뉴 선택했을 때
    SET_TEMP_SELECTED_MENUS: (state, action: PayloadAction<TProps>) => {
      state.tempSelectedMenus.push(action.payload);
    },
    // 장바구니 담기 눌렀을 때
    SET_CART_LISTS: (state, action: PayloadAction<any[]>) => {
      state.cartLists = [...state.cartLists, ...action.payload];
    },
  },
});

export const { SET_CART_LISTS, setCartModalObj, SET_TEMP_SELECTED_MENUS } =
  cart.actions;
export const cartForm = (state: AppState): TProps => state.cart;
export default cart.reducer;
