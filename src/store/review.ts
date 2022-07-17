import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {
  menu: {
    url: string;
    name: string;
  };
};

const initialState: TProps = {
  menu: {
    url: '',
    name: '',
  },
};

export const review = createSlice({
  name: 'review',
  initialState,
  reducers: {
    SET_MENU_IMAGE: (state: any, action: PayloadAction<any>) => {
      state.menu = action.payload;
    },
    INIT_MENU_IMAGE: (state: any, action: PayloadAction) => {
      state.menu = null;
    },
  },
});

export const { SET_MENU_IMAGE, INIT_MENU_IMAGE } = review.actions;
export const reviewSelector = (state: AppState): TProps => state.review;
export default review.reducer;
