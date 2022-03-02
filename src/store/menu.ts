import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IMenuDetails } from '@model/index';
/* TODO: type 지정 엉망임 */

type TProps = {
  menu: any;
  menuDetailItem: IMenuDetails | any;
};

const initialState: TProps = {
  menu: [],
  menuDetailItem: {},
};

export const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    SET_MENU: (state, action: PayloadAction<TProps>) => {
      state.menu = action.payload;
    },
    SET_MENU_DETAIL_ITEM: (state, action: PayloadAction<IMenuDetails> | any) => {
      state.menuDetailItem = action.payload;
    },
  },
});

export const { SET_MENU, SET_MENU_DETAIL_ITEM } = menu.actions;
export const menuSelector = (state: AppState): TProps => state.menu;
export default menu.reducer;
