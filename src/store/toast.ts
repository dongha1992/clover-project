import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

export type TToastConfig = {
  message: string;
  duration?: number;
};

const INITIAL_STATE: TToastConfig = {
  message: '',
  duration: 3000,
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState: INITIAL_STATE,
  reducers: {
    setToastConfig: (_, action: PayloadAction<TToastConfig>) => {
      const { message, duration } = action.payload;
      return { message, duration: duration ?? 3000 };
    },
  },
});

export const { setToastConfig } = toastSlice.actions;
export const toastSelector = (state: AppState) => state.toast;
export default toastSlice.reducer;
