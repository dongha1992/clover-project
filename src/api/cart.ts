import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IGetCartResponse } from '@model/index';

export const getCartsApi = (): Promise<AxiosResponse<IGetCartResponse>> => {
  return Api.get(`cart/v1/carts`);
};

export const getRecentDeliveryApi = (): Promise<AxiosResponse<IGetCartResponse>> => {
  return Api.get(`cart/v1/carts/delivery`);
};

export const postCartsApi = (): Promise<AxiosResponse<IGetCartResponse>> => {
  return Api.post(`cart/v1/carts/menu`);
};

export const deleteCartsApi = (): Promise<AxiosResponse<IGetCartResponse>> => {
  return Api.delete(`cart/v1/carts/menu`);
};

export const patchCartsApi = (): Promise<AxiosResponse<IGetCartResponse>> => {
  return Api.patch(`cart/v1/carts/menu`);
};
