import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  ILogin,
  IkakaoLogin,
  IConfimTel,
  IAuthTel,
  IAavilabiltyEmail,
  ISignupUser,
  ILoginResponse,
  ISignupResponse,
  IResponse,
  IConfirmTelResponse,
} from '@model/index';

export const userLogin = (
  data: ILogin
): Promise<AxiosResponse<ILoginResponse>> => {
  return Api.post('user/v1/login', data);
};

export const kakaoLogin = (data: IkakaoLogin): Promise<AxiosResponse<any>> => {
  return Api.post('/user/v1/signin-kakao', data);
};

export const authTel = (data: IAuthTel): Promise<AxiosResponse<IResponse>> => {
  return Api.post('/user/v1/auth/tel', data);
};

export const confirmTel = (
  data: IConfimTel
): Promise<AxiosResponse<IResponse>> => {
  return Api.post('/user/v1/confirm/tel', data);
};

export const availabilityEmail = (
  params: IAavilabiltyEmail
): Promise<AxiosResponse<IConfirmTelResponse>> => {
  return Api.get('/user/v1/availability/email', { params });
};
export const signup = (
  data: ISignupUser
): Promise<AxiosResponse<ISignupResponse>> => {
  return Api.post('/user/v1/users', data);
};

export const refreshToken = (
  refreshToken: string
): Promise<AxiosResponse<ILoginResponse>> => {
  return Api.post('/user/v1/token/refresh', { refreshToken });
};
