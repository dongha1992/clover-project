import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {
  cartLists: any;
  cartModalObj: any;
  selectedMenus: any;
};

const initialState: TProps = {
  cartLists: [],
  cartModalObj: {},
  selectedMenus: [],
};

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartLists: (state, action: PayloadAction<TProps>) => {},
    setCartModalObj: (state, action: PayloadAction<TProps>) => {
      state.cartModalObj = action.payload;
    },
    setSelectedMenus: (state, action: PayloadAction<TProps>) => {
      state.selectedMenus.push(action.payload);
    },
  },
});

export const { setCartLists, setCartModalObj, setSelectedMenus } = cart.actions;
export const cartForm = (state: AppState): TProps => state.cart;
export default cart.reducer;
