import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IGetMenus,
  IGetMenusResponse,
  IMenuReviewsResponse,
  IReviewsDetailResponse,
  IPostMenuReview,
  IResponse,
  ICompletionReviewsResponse,
  IWillWriteReviewsResponse,
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

export const editMenuReviewApi = ({ formData, reviewId }: { formData: FormData; reviewId: number }) => {
  return Api.patch(`menu/v1/review/${reviewId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getCompleteReviews = (): Promise<AxiosResponse<ICompletionReviewsResponse>> => {
  return Api.get(`menu/v1/reviews/completion`);
};

export const getWillWriteReviews = (): Promise<AxiosResponse<IWillWriteReviewsResponse>> => {
  return Api.get(`menu/v1/reviews/expectation`);
};
