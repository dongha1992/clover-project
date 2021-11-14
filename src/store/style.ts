import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {
  headerHeight: any;
};

const initialState: TProps = {
  headerHeight: 0,
};

export const style = createSlice({
  name: 'style',
  initialState,
  reducers: {
    setHeaderHeight: (state, action: PayloadAction<TProps>) => {
      return action.payload;
    },
  },
});

export const { setHeaderHeight } = style.actions;
export const headerHeightSelector = (state: AppState): TProps => state.style;
export default style.reducer;
