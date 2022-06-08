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
  ISubscriptionResponse,
  IGetSubscription,
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

export const editMenuReviewApi = ({
  formData,
  reviewId,
}: {
  formData: FormData;
  reviewId: number;
}): Promise<AxiosResponse<IResponse>> => {
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

export const getSubscriptionApi = ({
  id,
  destinationId,
  subscriptionPeriod,
  deliveryStartDate,
}: IGetSubscription): Promise<AxiosResponse<ISubscriptionResponse>> => {
  return Api.get(`menu/v1/menus/${id}/tables`, {
    params: { id, destinationId, subscriptionPeriod, deliveryStartDate },
  });
};

export const postNotificationApi = ({
  menuId,
  tel,
  type,
}: {
  menuId: number;
  tel: string;
  type: string;
}): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`menu/v1/notification?menuId=${menuId}&tel=${tel}&type=${type}`);
};
