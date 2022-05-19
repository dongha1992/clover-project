import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from '.';
import { setCookie, removeCookie } from '@utils/common';
import { userLoginApi } from '@api/user';

interface IMe {
  id: string;
  birthDate: string;
  email: string;
  marketingEmailReceived: boolean;
  marketingPushReceived: boolean;
  gender: string | null;
  name: string;
  nickName: string;
  password: string;
  marketingSmsReceived: boolean;
  notiPushReceived: boolean;
  primePushReceived: boolean;
  tel: string;
  point: number;
  emailConfirmed: boolean;
  telConfirmed: boolean;
  smsDenied: boolean;
  promotionCode: string;
  promotionCount: number;
  recommendCode: string;
  joinType: string;
  createdAt: string;
}

export interface IUser {
  tempPasswordLogin: string;
  isLoginSuccess: boolean;
  signupUser: {
    authCode?: string;
    birthDate?: string;
    email?: string;
    marketingEmailReceived?: boolean;
    gender?: string | null;
    name?: string;
    nickName?: string;
    password?: string;
    marketingSmsReceived?: boolean;
    tel?: string;
    loginType?: string;
  };
  me: IMe | null;
}

const initialState: IUser = {
  tempPasswordLogin: '',
  isLoginSuccess: false,
  signupUser: {
    authCode: '',
    birthDate: '',
    email: '',
    marketingEmailReceived: false,
    gender: null,
    name: '',
    nickName: '',
    password: '',
    marketingSmsReceived: false,
    tel: '',
    loginType: '',
  },
  me: null,
};

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_SIGNUP_USER: (state: any, { payload }: PayloadAction<IUser['signupUser']>) => {
      state.signupUser = { ...state.signupUser, ...payload };
    },

    SET_USER_AUTH: (state: any, { payload }: PayloadAction<any>) => {
      const accessTokenObj = {
        accessToken: payload.accessToken,
        expiresIn: payload.expiresIn,
      };

      sessionStorage.setItem('accessToken', JSON.stringify(accessTokenObj));

      const refreshTokenObj = JSON.stringify({
        refreshToken: payload.refreshToken,
        refreshTokenExpiresIn: payload.refreshTokenExpiresIn,
      });

      setCookie({
        name: 'refreshTokenObj',
        value: refreshTokenObj,
        option: {
          path: '/',
          maxAge: payload.refreshTokenExpiresIn,
        },
      });
    },

    SET_LOGIN_SUCCESS: (state: any, { payload }: PayloadAction<boolean>) => {
      state.isLoginSuccess = payload;
    },

    SET_TEMP_PASSWORD: (state: any, { payload }: PayloadAction<string>) => {
      state.tempPasswordLogin = payload;
    },

    SET_USER: (state: any, { payload }: PayloadAction<IUser['me'] | null>) => {
      state.me = payload;
    },
  },
  extraReducers: {},
});

export const { SET_SIGNUP_USER, SET_USER_AUTH, SET_USER, SET_LOGIN_SUCCESS, SET_TEMP_PASSWORD } = user.actions;
export const userForm = (state: AppState): IUser => state.user;
export default user.reducer;
