import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { 
  IPromotionRequest, 
  IResponse, 
  IMenuPromotionResponse,
  IMainPromotionContentsResponse,
  IExhibitionResponse,
} from '@model/index';

export const postPromotionCodeApi = (data: IPromotionRequest): Promise<AxiosResponse<IResponse>> => {
  return Api.post('promotion/v1/participation', data);
};

export const getPromotionCodeApi = (params: { type: string }): Promise<AxiosResponse<IMenuPromotionResponse>> => {
  return Api.get('promotion/v1/promotions', { params });
};

export const getMainPromotionContentsApi = (): Promise<AxiosResponse<IMainPromotionContentsResponse>> => {
  return Api.get('/main/v1/contents');
};

export const getExhibitionApi = (params: { page: number, size: number}): Promise<AxiosResponse<IExhibitionResponse>> => {
  return Api.get('/exhibition/v1/exhibitions', { params });
};

export const getExhibitionInquireApi = (id: number): Promise<AxiosResponse<IExhibitionResponse>> => {
  return Api.get(`/exhibition/v1/exhibition/${id}`);
};
