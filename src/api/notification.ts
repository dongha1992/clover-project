import { IGetNotiInfoResponse, IGetNotisRequest, IGetNotisResponse, IResponse } from '@model/index';
import { AxiosResponse } from 'axios';
import { Api } from './Api';

export const getNotiInfoApi = (): Promise<AxiosResponse<IGetNotiInfoResponse>> => {
  return Api.get('notification/v1/info');
};

export const getNotisApi = ({
  page = 1,
  size = 10,
  type,
}: IGetNotisRequest): Promise<AxiosResponse<IGetNotisResponse>> => {
  const params = {
    page,
    size,
    type,
  };
  return Api.get('notification/v1/notifications', { params });
};

export const postNotiCheckApi = (id: number): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`notification/v1/notifications/${id}/check`);
};
