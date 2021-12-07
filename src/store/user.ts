import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';

interface IUser {
  authCode?: string;
  birthDate?: string;
  email?: string;
  emailReceived?: boolean;
  gender?: string;
  name?: string;
  nickname?: string;
  password?: string;
  smsReceived?: boolean;
  tel?: string;
}

const initialState: IUser = {
  authCode: '',
  birthDate: '',
  email: '',
  emailReceived: false,
  gender: '',
  name: '',
  nickname: '',
  password: '',
  smsReceived: false,
  tel: '',
};

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_USER: (state, action: PayloadAction<IUser>) => {
      console.log(action.payload);
      return { ...state, ...action.payload };
    },
  },
});

export const { SET_USER } = user.actions;
export const userForm = (state: AppState): IUser => state.user;
export default user.reducer;
