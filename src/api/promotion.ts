import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IPromotionRequest, IResponse } from '@model/index';

export const postPromotionCodeApi = (data: IPromotionRequest): Promise<AxiosResponse<IResponse>> => {
  return Api.post('promotion/v1/participation', data);
};
