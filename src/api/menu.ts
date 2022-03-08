import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IGetMenus,
  IGetMenusResponse,
  IMenuReviewsResponse,
  IReviewsDetailResponse,
  IPostMenuReview,
  IResponse,
} from '@model/index';

export const getMenusApi = (params: IGetMenus): Promise<AxiosResponse<IGetMenusResponse>> => {
  return Api.get(`menu/v1/menus/`, { params });
};

export const getMenuDetailApi = (id: number): Promise<AxiosResponse<any>> => {
  return Api.get(`menu/v1/menus/${id}`);
};

export const getMenuDetailReviewApi = (id: number): Promise<AxiosResponse<IMenuReviewsResponse>> => {
  return Api.get(`menu/v1/reviews?menuId=${id}`);
};

export const getReviewDetailApi = (reivewId: number): Promise<AxiosResponse<IReviewsDetailResponse>> => {
  return Api.get(`menu/v1/reviews/${reivewId}`);
};

export const createMenuReviewApi = (formData: any): Promise<AxiosResponse<IResponse>> => {
  return Api.post('menu/v1/reviews', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
