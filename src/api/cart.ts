import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IGetCartResponse, IResponse, ICreateCartRequest, IDeleteCartRequest, IPatchCartRequest } from '@model/index';

export const getCartsApi = (): Promise<AxiosResponse<IGetCartResponse>> => {
  return Api.get(`cart/v1/carts`);
};

export const getRecentDeliveryApi = (): Promise<AxiosResponse<IResponse>> => {
  return Api.get(`cart/v1/carts/delivery`);
};

export const postCartsApi = (data: ICreateCartRequest[]): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`cart/v1/carts/menu`, data);
};

export const deleteCartsApi = (data: IDeleteCartRequest[]): Promise<AxiosResponse<IResponse>> => {
  return Api.delete(`cart/v1/carts/menu`, { data });
};

export const patchCartsApi = (data: IPatchCartRequest): Promise<AxiosResponse<IResponse>> => {
  return Api.patch(`cart/v1/carts/menu`, data);
};
