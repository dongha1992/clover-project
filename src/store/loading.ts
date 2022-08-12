import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  isShown: boolean
}

const initialState: LoadingState = {
  isShown: false
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    show: (state) => {
      state.isShown = true;
    },
    hide: (state) => {
      state.isShown = false;
    },
  },
});
export const { show, hide } = loadingSlice.actions;
export default loadingSlice.reducer;