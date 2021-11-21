import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {
  cartLists: any;
  cartItem: any;
};

const initialState: TProps = {
  cartLists: [],
  cartItem: {},
};

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartLists: (state, action: PayloadAction<TProps>) => {},
    setCartItem: (state, action: PayloadAction<TProps>) => {
      state.cartItem = action.payload;
    },
  },
});

export const { setCartLists, setCartItem } = cart.actions;
export const cartForm = (state: AppState): TProps => state.cart;
export default cart.reducer;
