import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { IAccessMethod } from '@model/index';

export interface IViewer {
  images: string[];
  index: number;
}
interface IState {
  imagesForViewer: IViewer;
  isMobile: boolean;
  isLoading: boolean;
  loginType: string;
  versionOfTerm: number;
  withInDays: number;
  userAccessMethod: IAccessMethod | undefined;
  isScroll: boolean;
}

const INITIAL_STATE: IState = {
  imagesForViewer: { images: [], index: 0 },
  isMobile: false,
  isLoading: false,
  loginType: 'NONMEMBER',
  versionOfTerm: 2,
  withInDays: 90,
  userAccessMethod: undefined,
  isScroll: false,
};

export const commonSlice = createSlice({
  name: 'common',
  initialState: INITIAL_STATE,
  reducers: {
    SET_IMAGE_VIEWER: (state: any, { payload }: PayloadAction<IViewer>) => {
      state.imagesForViewer = payload;
    },
    INIT_IMAGE_VIEWER: (state: any, action: PayloadAction) => {
      state.imagesForViewer = { url: [], index: 0 };
    },
    SET_IS_MOBILE: (state: any, { payload }: PayloadAction<boolean>) => {
      state.isMobile = payload;
    },
    SET_IS_LOADING: (state: any, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    SET_LOGIN_TYPE: (state: any, { payload }: PayloadAction<string>) => {
      state.loginType = payload;
    },
    SET_VERSION_OF_TERM: (state: any, { payload }: PayloadAction<number>) => {
      state.versionOfTerm = payload;
    },
    SET_ORDER_LIST_FILTER: (state: any, { payload }: PayloadAction<number>) => {
      state.withInDays = payload;
    },
    SET_ACCESS_METHOD: (state: any, { payload }: PayloadAction<IAccessMethod | undefined>) => {
      state.userAccessMethod = payload;
    },
    INIT_ACCESS_METHOD: (state: any, action: PayloadAction) => {
      state.userAccessMethod = undefined;
    },
    SET_SCROLL: (state: any, { payload }: PayloadAction<boolean>) => {
      state.isScroll = payload;
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
  SET_ORDER_LIST_FILTER,
  SET_ACCESS_METHOD,
  INIT_ACCESS_METHOD,
  SET_SCROLL,
} = commonSlice.actions;
export const commonSelector = (state: AppState): IState => state.common;
export default commonSlice.reducer;
