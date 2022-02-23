import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {
  content: JSX.Element | null;
  submitHandler?: () => void | null;
};

const initialState: TProps = {
  content: null,
  submitHandler: () => {},
};

export const style = createSlice({
  name: 'bottomSheet',
  initialState,
  reducers: {
    SET_BOTTOM_SHEET: (state, action: PayloadAction<TProps> | null) => {
      return action?.payload;
    },
    INIT_BOTTOM_SHEET: (state, action: PayloadAction) => {
      state.content = null;
    },
  },
});

export const { SET_BOTTOM_SHEET, INIT_BOTTOM_SHEET } = style.actions;
export const bottomSheetForm = (state: AppState): TProps | null => state.bottomSheet;
export default style.reducer;
