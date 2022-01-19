import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IAccessMethod } from '@pages/payment';
interface IState {
  imagesForViewer: string[];
  isMobile: boolean;
  isLoading: boolean;
  versionOfTerm: number;
  userAccessMethod: IAccessMethod;
}

const INITIAL_STATE: IState = {
  imagesForViewer: [],
  isMobile: false,
  isLoading: false,
  versionOfTerm: 2,
  userAccessMethod: {
    id: 1,
    text: '',
    value: '',
  },
};

export const commonSlice = createSlice({
  name: 'common',
  initialState: INITIAL_STATE,
  reducers: {
    SET_IMAGE_VIEWER: (state, { payload }: PayloadAction<string[]>) => {
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
    SET_ACCESS_METHOD: (state, { payload }: PayloadAction<IAccessMethod>) => {
      state.userAccessMethod = payload;
    },
  },
});

export const {
  SET_IMAGE_VIEWER,
  INIT_IMAGE_VIEWER,
  SET_IS_MOBILE,
  SET_IS_LOADING,
  SET_VERSION_OF_TERM,
  SET_ACCESS_METHOD,
} = commonSlice.actions;
export const commonSelector = (state: AppState) => state.common;
export default commonSlice.reducer;
