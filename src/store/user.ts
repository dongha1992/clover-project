import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from '.';
import { setCookie, removeCookie } from '@utils/cookie';
import { userLogin } from '@api/user';

interface IUser {
  tempPasswordLogin: string;
  isLoginSuccess: boolean;
  signupUser: {
    authCode?: string;
    birthDate?: string;
    email?: string;
    marketingEmailReceived?: boolean;
    gender?: string;
    name?: string;
    nickname?: string;
    password?: string;
    marketingSmsReceived?: boolean;
    tel?: string;
    loginType?: string;
  };
  user: {
    id: string;
    birthDate: string;
    email: string;
    marketingEmailReceived: boolean;
    gender: string;
    name: string;
    nickname: string;
    password: string;
    marketingSmsReceived: boolean;
    tel: string;
    point: number;
    emailConfirmed: boolean;
    telConfirmed: boolean;
    smsDenied: boolean;
    promotionCode: string;
    promotionCount: number;
    recommendCode: boolean;
    joinType: string;
    createdAt: string;
  };
}

const initialState: IUser = {
  tempPasswordLogin: '',
  isLoginSuccess: false,
  signupUser: {
    authCode: '',
    birthDate: '',
    email: '',
    marketingEmailReceived: false,
    gender: '',
    name: '',
    nickname: '',
    password: '',
    marketingSmsReceived: false,
    tel: '',
    loginType: '',
  },
  user: {
    id: '',
    birthDate: '',
    email: '',
    marketingEmailReceived: false,
    gender: '',
    name: '',
    nickname: '',
    password: '',
    marketingSmsReceived: false,
    tel: '',
    point: 0,
    emailConfirmed: false,
    telConfirmed: false,
    smsDenied: false,
    promotionCode: '',
    promotionCount: 0,
    recommendCode: false,
    joinType: '',
    createdAt: '',
  },
};

export const SET_USER_LOGIN_AUTH = createAsyncThunk(
  'user/SET_USER_LOGIN_AUTH',
  async (payload: any, thunkAPI) => {
    const { data } = await userLogin({
      ...payload,
    });
    if (data.code === 200) {
      const userTokenObj = data.data;
      return { ...userTokenObj };
    }
  }
);

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_SIGNUP_USER: (
      state,
      { payload }: PayloadAction<IUser['signupUser']>
    ) => {
      state.signupUser = { ...state.signupUser, ...payload };
    },

    SET_USER_AUTH: (state, { payload }: PayloadAction<any>) => {
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

    SET_LOGIN_SUCCESS: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoginSuccess = payload;
    },

    SET_TEMP_PASSWORD: (state, { payload }: PayloadAction<string>) => {
      state.tempPasswordLogin = payload;
    },

    SET_USER: (state, { payload }: PayloadAction<IUser['user']>) => {
      state.user = payload;
    },
  },
  extraReducers: {
    [SET_USER_LOGIN_AUTH.fulfilled.type]: (
      state,
      action: PayloadAction<any>
    ) => {},
    [SET_USER_LOGIN_AUTH.pending.type]: () => {},
    [SET_USER_LOGIN_AUTH.rejected.type]: () => {},
  },
});

export const {
  SET_SIGNUP_USER,
  SET_USER_AUTH,
  SET_USER,
  SET_LOGIN_SUCCESS,
  SET_TEMP_PASSWORD,
} = user.actions;
export const userForm = (state: AppState): IUser => state.user;
export default user.reducer;
