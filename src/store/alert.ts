import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { AppState } from '.';

type TAlert = {
  alertMessage?: string;
  alertSubMessage?: string;
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
    SET_ALERT: (state, action: PayloadAction<TAlert | null>) => {
      return action.payload;
    },
    INIT_ALERT: (state, action: PayloadAction) => {
      return null;
    },
  },
});

export const { SET_ALERT, INIT_ALERT } = alert.actions;
export const alertForm = (state: AppState): TAlert | null => state.alert;
export default alert.reducer;
