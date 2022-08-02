import { AxiosResponse } from 'axios';
import {
  ILogin,
  ILoginResponse,
} from '@model/index';

import {PublicApi} from "@api/publicApi";

export const userLoginApi = (data: ILogin): Promise<AxiosResponse<ILoginResponse>> => {
  return PublicApi.post('/user/v1/login', data);
};

export const userRefreshToken = (refreshToken: string): Promise<AxiosResponse<ILoginResponse>> => {
  return PublicApi.post('/user/v1/token/refresh', {
    refreshToken: `Bearer ${refreshToken}`,
  });
};