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

export const getCartsApi = ({
  params,
}: {
  params: {
    delivery: string;
    deliveryDate: string;
    spotId?: number | null;
  };
}): Promise<AxiosResponse<IGetCartResponse>> => {
  return Api.get(`cart/v1/carts`, { params });
};

export const getRecentDeliveryApi = (): Promise<AxiosResponse<IResponse>> => {
  return Api.get(`cart/v1/carts/delivery`);
};

export const postCartsApi = (data: ICreateCartRequest[]): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`cart/v1/carts`, data);
};

export const deleteCartsApi = (data: IDeleteCartRequest[], cartId: number): Promise<AxiosResponse<IResponse>> => {
  return Api.delete(`cart/v1/carts/${cartId}`, { data });
};

export const patchCartsApi = (data: IPatchCartRequest): Promise<AxiosResponse<IResponse>> => {
  return Api.patch(`cart/v1/carts/menu`, data);
};

export const getCartCountApi = (): Promise<AxiosResponse<ICartCountResponse>> => {
  return Api.get(`cart/v1/carts/count`);
};
