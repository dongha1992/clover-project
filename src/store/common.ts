import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IAccessMethod } from '@pages/payment';
interface IState {
  imagesForViewer: string[];
  isMobile: boolean;
  isLoading: boolean;
  loginType: string;
  versionOfTerm: number;
  userAccessMethod: IAccessMethod | undefined;
  withInDays: number;
}

const INITIAL_STATE: IState = {
  imagesForViewer: [],
  isMobile: false,
  isLoading: false,
  loginType: 'NONMEMBER',
  versionOfTerm: 2,
  userAccessMethod: undefined,
  withInDays: 90,
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
    SET_LOGIN_TYPE: (state, { payload }: PayloadAction<string>) => {
      state.loginType = payload;
    },
    SET_VERSION_OF_TERM: (state, { payload }: PayloadAction<number>) => {
      state.versionOfTerm = payload;
    },
    SET_ACCESS_METHOD: (state, { payload }: PayloadAction<IAccessMethod | undefined>) => {
      state.userAccessMethod = payload;
    },
    SET_ORDER_LIST_FILTER: (state, { payload }: PayloadAction<number>) => {
      state.withInDays = payload;
    },
  },
});

export const {
  SET_IMAGE_VIEWER,
  INIT_IMAGE_VIEWER,
  SET_IS_MOBILE,
  SET_IS_LOADING,
  SET_LOGIN_TYPE,
  SET_VERSION_OF_TERM,
  SET_ACCESS_METHOD,
  SET_ORDER_LIST_FILTER,
} = commonSlice.actions;
export const commonSelector = (state: AppState): IState => state.common;
export default commonSlice.reducer;
