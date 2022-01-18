import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

export type TModalOption = {
  imagesForViewer: any;
  isMobile: boolean;
  isLoading: boolean;
  versionOfTerm: number;
};

const INITIAL_STATE: TModalOption = {
  imagesForViewer: [],
  isMobile: false,
  isLoading: false,
  versionOfTerm: 2,
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
    SET_VERSION_OF_TERM: (state, { payload }: PayloadAction<number>) => {
      state.versionOfTerm = payload;
    },
  },
});

export const {
  SET_IMAGE_VIEWER,
  INIT_IMAGE_VIEWER,
  SET_IS_MOBILE,
  SET_IS_LOADING,
  SET_VERSION_OF_TERM,
} = commonSlice.actions;
export const commonSelector = (state: AppState) => state.common;
export default commonSlice.reducer;
