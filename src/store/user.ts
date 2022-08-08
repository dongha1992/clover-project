import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from '.';
import { setCookie } from '@utils/common';

interface IMe {
  id: string;
  birthDate: string;
  email: string;
  marketingEmailReceived: boolean;
  marketingPushReceived: boolean;
  gender: string | null;
  name: string;
  nickname: string;
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
  grade: {
    benefit: { accumulationRate: number };
    level: number;
    name: string;
  };
}

export interface IUser {
  tempPasswordLogin: string;
  isLoginSuccess: boolean;
  signupUser: {
    appleToken?: string | null;
    authCode?: string;
    birthDate?: string;
    email?: string;
    marketingEmailReceived?: boolean;
    gender?: string | null;
    name?: string;
    nickname?: string;
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
    nickname: '',
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

    INIT_SIGNUP_USER: (state: any, action: PayloadAction) => {
      state.signupUser = initialState.signupUser;
    },

    SET_USER_AUTH: (state: any, { payload }: PayloadAction<any>) => {
      console.log('payload', payload);

      const accessTokenObj = {
        accessToken: payload.accessToken,
        expiresIn: payload.expiresIn,
      };

      // sessionStorage.setItem('accessToken', JSON.stringify(accessTokenObj));
      setCookie({
        name: 'acstk',
        value: JSON.stringify(accessTokenObj),
        option: {
          path: '/',
          maxAge: accessTokenObj.expiresIn,
        },
      });

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

    INIT_TEMP_PASSWORD: (state: any, { payload }: PayloadAction) => {
      state.tempPasswordLogin = '';
    },

    SET_USER: (state: any, { payload }: PayloadAction<IUser['me'] | null>) => {
      state.me = payload;
    },
    INIT_USER: (state: any, { payload }: PayloadAction) => {
      state.me = null;
      state.isLoginSuccess = false;
    },
  },
  extraReducers: {},
});

export const {
  SET_SIGNUP_USER,
  SET_USER_AUTH,
  SET_USER,
  SET_LOGIN_SUCCESS,
  SET_TEMP_PASSWORD,
  INIT_SIGNUP_USER,
  INIT_TEMP_PASSWORD,
  INIT_USER,
} = user.actions;
export const userForm = (state: AppState): IUser => state.user;
export default user.reducer;
