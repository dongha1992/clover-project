import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TOrder = 'ORDER_COUNT_DESC' | 'LAUNCHED_DESC' | 'PRICE_DESC' | 'PRICE_ASC' | 'REVIEW_COUNT_DESC' | string;
type TFilter = 'ALL' | 'VEGAN' | 'SEAFOOD' | 'MEAT' | 'DAIRY_PRODUCTS' | string;
interface ICategoryFilter {
  filter: TFilter[];
  order: TOrder;
}

type TProps = {
  categoryFilters: ICategoryFilter | null;
  type: string;
};

const initialState: TProps = {
  categoryFilters: null,
  type: '',
};

export const filter = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    SET_CATEGORY_FILTER: (state: any, action: PayloadAction<ICategoryFilter>) => {
      state.categoryFilters = action.payload;
    },
    INIT_CATEGORY_FILTER: (state: any, action: PayloadAction) => {
      state.categoryFilters = null;
    },
    SET_MENU_TAB: (state: any, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    INIT_MENU_TAB: (state: any, action: PayloadAction) => {
      state.type = '';
    },
  },
});

export const { SET_CATEGORY_FILTER, INIT_CATEGORY_FILTER, SET_MENU_TAB, INIT_MENU_TAB } = filter.actions;
export const filterSelector = (state: AppState): TProps => state.filter;
export default filter.reducer;
