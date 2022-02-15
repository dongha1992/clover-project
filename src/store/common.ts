import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IAccessMethod } from '@pages/payment';
interface IState {
  imagesForViewer: string[];
  isMobile: boolean;
  isLoading: boolean;
  isAutoLogin: boolean;
  loginType: string;
  versionOfTerm: number;
  userAccessMethod: IAccessMethod;
}

const INITIAL_STATE: IState = {
  imagesForViewer: [],
  isMobile: false,
  isLoading: false,
  isAutoLogin: false,
  loginType: 'NONMEMBER',
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
    SET_IS_AUTOLOGIN: (state, { payload }: PayloadAction<boolean>) => {
      state.isAutoLogin = payload;
    },
    SET_LOGIN_TYPE: (state, { payload }: PayloadAction<string>) => {
      state.loginType = payload;
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
  SET_IS_AUTOLOGIN,
  SET_LOGIN_TYPE,
  SET_VERSION_OF_TERM,
  SET_ACCESS_METHOD,
} = commonSlice.actions;
export const commonSelector = (state: AppState): IState => state.common;
export default commonSlice.reducer;
