import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IPromotionRequest, IResponse, IMenuPromotionResponse } from '@model/index';

export const postPromotionCodeApi = (data: IPromotionRequest): Promise<AxiosResponse<IResponse>> => {
  return Api.post('promotion/v1/participation', data);
};

export const getPromotionCodeApi = (params: { type: string }): Promise<AxiosResponse<IMenuPromotionResponse>> => {
  return Api.get('promotion/v1/promotions', { params });
};
