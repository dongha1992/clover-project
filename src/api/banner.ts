import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IBanner, IGetBannersResponse } from '@model/index';

export const getBannersApi = (
  params: IBanner
): Promise<AxiosResponse<IGetBannersResponse>> => {
  return Api.get('banner/v1/banners', { params });
};

export const getBannerDetailApi = (
  id: number
): Promise<AxiosResponse<IGetBannersResponse>> => {
  return Api.get(`banner/v1/banners/${id}`, { params: id });
};
