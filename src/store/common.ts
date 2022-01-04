import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

export type TModalOption = {
  imagesForViewer: any;
  isMobile: boolean;
  isLoading: boolean;
};

const INITIAL_STATE: TModalOption = {
  imagesForViewer: [],
  isMobile: false,
  isLoading: false,
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
    SET_IS_MOBILE: (state, { payload }: PayloadAction<boolean>) => {
      state.isMobile = payload;
    },
    SET_IS_LOADING: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
  },
});

export const {
  SET_IMAGE_VIEWER,
  INIT_IMAGE_VIEWER,
  SET_IS_MOBILE,
  SET_IS_LOADING,
} = commonSlice.actions;
export const commonSelector = (state: AppState) => state.common;
export default commonSlice.reducer;
