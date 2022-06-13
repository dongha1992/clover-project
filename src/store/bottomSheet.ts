import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {
  content: JSX.Element | null;
  submitHandler?: () => void | null;
  height?: string | null;
};

const initialState: TProps = {
  content: null,
  submitHandler: () => {},
  height: null
};

export const style = createSlice({
  name: 'bottomSheet',
  initialState,
  reducers: {
    SET_BOTTOM_SHEET: (state: any, action: PayloadAction<TProps> | null) => {
      return action?.payload;
    },
    INIT_BOTTOM_SHEET: (state: any, action: PayloadAction) => {
      state.content = null;
    },
  },
});

export const { SET_BOTTOM_SHEET, INIT_BOTTOM_SHEET } = style.actions;
export const bottomSheetForm = (state: AppState): TProps | null => state.bottomSheet;
export default style.reducer;
