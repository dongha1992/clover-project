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
  IHelpEmail,
  IHelpPassword,
  IChangePassword,
  ISecessionResponse,
  IInvitationResponse,
  IChangeMe,
  IUserInfoResponse,
} from '@model/index';

export const userLoginApi = (data: ILogin): Promise<AxiosResponse<ILoginResponse>> => {
  return Api.post('/user/v1/login', data);
};

export const userAuthTel = (data: IAuthTel): Promise<AxiosResponse<IResponse>> => {
  return Api.post('/user/v1/auth/tel', data);
};

export const userConfirmTel = (data: IConfimTel): Promise<AxiosResponse<IResponse>> => {
  return Api.post('/user/v1/confirm/tel', data);
};

export const availabilityEmail = (params: IAavilabiltyEmail): Promise<AxiosResponse<IConfirmTelResponse>> => {
  return Api.get('/user/v1/availability/email', { params });
};
export const userSignup = (data: ISignupUser): Promise<AxiosResponse<ISignupResponse>> => {
  return Api.post('/user/v1/users', data);
};

export const userSecession = <params>(data: params): Promise<AxiosResponse<ISecessionResponse>> => {
  return Api.delete('/user/v1/users', { data });
};

export const userRefreshToken = (refreshToken: string): Promise<AxiosResponse<ILoginResponse>> => {
  return Api.post('/user/v1/token/refresh', {
    refreshToken: `Bearer ${refreshToken}`,
  });
};

export const userProfile = (): Promise<AxiosResponse<any>> => {
  return Api.get('/user/v1/me');
};

export const userHelpEmail = (data: IHelpEmail): Promise<AxiosResponse<IResponse>> => {
  return Api.post('/user/v1/help/email', data);
};

export const userHelpPassword = (data: IHelpPassword): Promise<AxiosResponse<IResponse>> => {
  return Api.post('/user/v1/help/password', data);
};

export const userConfirmPassword = (data: any): Promise<AxiosResponse<any>> => {
  return Api.post('/user/v1/confirm/password', data);
};

export const userChangePassword = (data: IChangePassword): Promise<AxiosResponse<any>> => {
  return Api.post('/user/v1/password', data);
};

export const userUnlock = (): Promise<AxiosResponse<any>> => {
  return Api.post('/user/v1/unlock');
};

export const userRecommendationApi = (params: { recommendCode: string }): Promise<AxiosResponse<IResponse>> => {
  return Api.post('/user/v1/recommendation', { params });
};

export const userInvitationApi = (): Promise<AxiosResponse<IInvitationResponse>> => {
  return Api.get('/user/v1/invitation');
};

export const userChangeInfo = (data: IChangeMe): Promise<AxiosResponse<IResponse>> => {
  return Api.patch('/user/v1/me', data);
};

export const getUserInfoApi = (): Promise<AxiosResponse<IUserInfoResponse>> => {
  return Api.get('/user/v1/info');
};
