import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {} from '@model/index';

export const postPromotionCodeApi = (data: IPromotionRequest): Promise<AxiosResponse<IResponse>> => {
  return Api.get('promotion/v1/participation', data);
};
