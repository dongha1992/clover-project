import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

export type TModalOption = {
  imagesForViewer: any;
};

const INITIAL_STATE: TModalOption = {
  imagesForViewer: [],
};

export const commonSlice = createSlice({
  name: 'common',
  initialState: INITIAL_STATE,
  reducers: {
    SET_IMAGE_VIEWER: (state, { payload }: PayloadAction<TModalOption>) => {
      state.imagesForViewer = payload;
    },
    INIT_IMAGE_VIEWER: (state, action: PayloadAction) => {
      state.imagesForViewer = [];
    },
  },
});

export const { SET_IMAGE_VIEWER, INIT_IMAGE_VIEWER } = commonSlice.actions;
export const commonSelector = (state: AppState) => state.common;
export default commonSlice.reducer;
