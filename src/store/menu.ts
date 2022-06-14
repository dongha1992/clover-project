import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IMenus } from '@model/index';

type TProps = {
  menu: any;
  menuItem: IMenus | any;
};

const initialState: TProps = {
  menu: [],
  menuItem: {},
};

export const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    SET_MENU: (state: any, action: PayloadAction<TProps>) => {
      state.menu = action.payload;
    },
    SET_MENU_ITEM: (state: any, action: PayloadAction<IMenus> | any) => {
      state.menuItem = action.payload;
    },
  },
});

export const { SET_MENU, SET_MENU_ITEM } = menu.actions;
export const menuSelector = (state: AppState): TProps => state.menu;
export default menu.reducer;
