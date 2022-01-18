import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

type TProps = {
  content: JSX.Element | null;
  buttonTitle?: string | null;
  submitHandler?: () => void | null;
};

const initialState: TProps = {
  content: null,
  buttonTitle: '',
  submitHandler: () => {},
};

export const style = createSlice({
  name: 'bottomSheet',
  initialState,
  reducers: {
    setBottomSheet: (state, action: PayloadAction<TProps> | null) => {
      return action?.payload;
    },
    initBottomSheet: (state, action: PayloadAction) => {
      state.content = null;
      state.buttonTitle = '';
    },
  },
});

export const { setBottomSheet, initBottomSheet } = style.actions;
export const bottomSheetForm = (state: AppState): TProps | null =>
  state.bottomSheet;
export default style.reducer;
