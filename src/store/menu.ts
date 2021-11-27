import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IMenuItem } from '@pages/menu/[id]';

/* TODO: type 지정 엉망임 */

type TProps = {
  menu: any;
  menuItem: IMenuItem | any;
};

const initialState: TProps = {
  menu: [],
  menuItem: {},
};

export const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    SET_MENU: (state, action: PayloadAction<TProps>) => {
      state.menu = action.payload;
    },
    SET_MENU_ITEM: (state, action: PayloadAction<IMenuItem> | any) => {
      state.menuItem = action.payload;
    },
  },
});

export const { SET_MENU, SET_MENU_ITEM } = menu.actions;
export const menuSelector = (state: AppState): TProps => state.menu;
export default menu.reducer;
