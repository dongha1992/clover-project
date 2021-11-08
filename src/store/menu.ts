import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {
  menu: any;
};

const initialState: TProps = {
  menu: [],
};

export const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<TProps>) => {
      return action.payload;
    },
  },
});

export const { setMenu } = menu.actions;
export const menuSelector = (state: AppState): TProps => state.menu;
export default menu.reducer;
