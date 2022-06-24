import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IGetMenus,
  IGetMenusResponse,
  IMenuReviewsResponse,
  IReviewsDetailResponse,
  IPostMenuReview,
  IMenuDetailsResponse,
  IResponse,
  ICompletionReviewsResponse,
  IWillWriteReviewsResponse,
  ISubscriptionResponse,
  IGetSubscription,
  IGetOrderMenusResponse,
} from '@model/index';

export const getMenusApi = (params: IGetMenus): Promise<AxiosResponse<IGetMenusResponse>> => {
  return Api.get(`menu/v1/menus/`, { params });
};

export const getMenuDetailApi = (id: number): Promise<AxiosResponse<IMenuDetailsResponse>> => {
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

export const deleteReviewApi = ({ id }: { id: number }): Promise<AxiosResponse<IResponse>> => {
  return Api.delete(`menu/v1/reviews/${id}`);
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

export const deleteNotificationApi = (menuId: number): Promise<AxiosResponse<IResponse>> => {
  return Api.delete(`menu/v1/notification/${menuId}`);
};

export const getLikeMenus = (menuPattern: string): Promise<AxiosResponse<any>> => {
  return Api.get(`menu/v1/menus/like`, { params: { menuPattern } });
};

export const postLikeMenus = ({ menuId }: { menuId: number }): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`menu/v1/like${menuId}`);
};

export const deleteLikeMenus = ({ menuId }: { menuId: number }): Promise<AxiosResponse<IResponse>> => {
  return Api.delete(`menu/v1/like/${menuId}`);
};

export const getRecommendMenusApi = (): Promise<AxiosResponse<IGetMenusResponse>> => {
  return Api.get(`menu/v1/menus/recommend`);
};

export const getOrderedMenusApi = ({
  params,
}: {
  params: { size: number };
}): Promise<AxiosResponse<IGetOrderMenusResponse>> => {
  return Api.get(`menu/v1/details/ordered`, { params });
};
