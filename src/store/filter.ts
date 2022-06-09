import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TOrder = 'ORDER_COUNT_DESC' | 'LAUNCHED_DESC' | 'PRICE_DESC' | 'PRICE_ASC' | 'REVIEW_COUNT_DESC' | string;
type TFilter = 'ALL' | 'VEGAN' | 'SEAFOOD' | 'MEAT' | 'DAIRY_PRODUCTS' | string;
interface ICategoryFilter {
  filter: TFilter[];
  order: TOrder;
}

type TProps = {
  categoryFilters: ICategoryFilter;
};

const initialState: TProps = {
  categoryFilters: { filter: [], order: '' },
};

export const filter = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    SET_CATEGORY_FILTER: (state: any, action: PayloadAction<ICategoryFilter>) => {
      state.categoryFilters = action.payload;
    },
    INIT_CATEGORY_FILTER: (state: any, action: PayloadAction) => {
      state.categoryFilters = { filter: [], order: '' };
    },
  },
});

export const { SET_CATEGORY_FILTER, INIT_CATEGORY_FILTER } = filter.actions;
export const filterSelector = (state: AppState): TProps => state.filter;
export default filter.reducer;
