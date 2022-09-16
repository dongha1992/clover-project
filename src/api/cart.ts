import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IGetCartResponse,
  IResponse,
  ICreateCartRequest,
  IDeleteCartRequest,
  IPatchCartRequest,
  ICartCountResponse,
} from '@model/index';

interface IProps {
  delivery?: string | null;
  deliveryDate?: string | null;
  spotId?: number | null;
}

export const getCartsApi = (params: IProps | undefined): Promise<AxiosResponse<IGetCartResponse>> => {
  return Api.get(`cart/v1/carts`, params && { params });
};

export const postCartsApi = (data: ICreateCartRequest[]): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`cart/v1/carts`, data);
};

export const deleteCartsApi = (data: IDeleteCartRequest[]): Promise<AxiosResponse<IResponse>> => {
  return Api.delete(`cart/v1/carts`, { data });
};

export const patchCartsApi = (data: IPatchCartRequest): Promise<AxiosResponse<IResponse>> => {
  return Api.patch(`cart/v1/carts/menu`, data);
};

export const getCartCountApi = (): Promise<AxiosResponse<ICartCountResponse>> => {
  return Api.get(`cart/v1/carts/count`);
};
