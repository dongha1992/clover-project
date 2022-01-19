import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IGetBanners, IGetBannersResponse } from '@model/index';

export const banners = (
  type: string
): Promise<AxiosResponse<IGetBannersResponse>> => {
  return Api.get('banner/v1/banners', { params: type });
};

export const banner = (
  id: number
): Promise<AxiosResponse<IGetBannersResponse>> => {
  return Api.get(`banner/v1/banners/${id}`, { params: id });
};
