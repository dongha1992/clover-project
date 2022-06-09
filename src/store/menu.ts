import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IMenus } from '@model/index';

type TOrder = 'ORDER_COUNT_DESC' | 'LAUNCHED_DESC' | 'PRICE_DESC' | 'PRICE_ASC' | 'REVIEW_COUNT_DESC' | string;
type TFilter = 'ALL' | 'VEGAN' | 'SEAFOOD' | 'MEAT' | 'DAIRY_PRODUCTS' | string;
interface ICategoryFilter {
  filter: TFilter[];
  order: TOrder;
}

type TProps = {
  menu: any;
  menuItem: IMenus | any;
  categoryFilters: ICategoryFilter;
};

const initialState: TProps = {
  menu: [],
  menuItem: {},
  categoryFilters: { filter: [], order: '' },
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
    SET_CATEGOYR_FILTER: (state: any, action: PayloadAction<ICategoryFilter>) => {
      state.categoryFilters = action.payload;
    },
    INIT_CATEGOYR_FILTER: (state: any, action: PayloadAction) => {
      state.categoryFilters = { filter: [], order: '' };
    },
  },
});

export const { SET_MENU, SET_MENU_ITEM, SET_CATEGOYR_FILTER, INIT_CATEGOYR_FILTER } = menu.actions;
export const menuSelector = (state: AppState): TProps => state.menu;
export default menu.reducer;
