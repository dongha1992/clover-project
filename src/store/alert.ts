import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { AppState } from '.';

type TAlert = {
  alertMessage: string;
  submitBtnText?: string;
  closeBtnText?: string;
  onSubmit?: () => void;
  onClose?: () => void;
  type?: string;
  setSelectedMenu?: React.Dispatch<React.SetStateAction<string>>;
  selectedMenu?: string;
  children?: JSX.Element;
};

export const alert = createSlice({
  name: 'alert',
  initialState: null as null | TAlert,
  reducers: {
    setAlert: (state, action: PayloadAction<TAlert | null>) => {
      return action.payload;
    },
  },
});

export const { setAlert } = alert.actions;
export const alertForm = (state: AppState): TAlert | null => state.alert;
export default alert.reducer;
