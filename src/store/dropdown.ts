import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

export type TDropdownOption = {
  optionTextObj: any;
};

const INITIAL_STATE: TDropdownOption = {
  optionTextObj: {},
};

export const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState: INITIAL_STATE,
  reducers: {
    setDropdownOption: (_, action: PayloadAction<TDropdownOption>) => {
      return { optionTextObj: action.payload };
    },
  },
});

export const { setDropdownOption } = dropdownSlice.actions;
export const dropdownSelector = (state: AppState) => state.dropdown;
export default dropdownSlice.reducer;
