import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IGetOrderList } from '@model/index';

export const getOrderLists = ({ days = 90, page = 1, size = 1, type }: IGetOrderList): Promise<AxiosResponse<any>> => {
  const params = {
    days,
    page,
    size,
    type,
  };
  return Api.get(`order/v1/orders/`, { params });
};

export const getOrderDetail = (id: number): Promise<AxiosResponse<any>> => {
  return Api.get(`order/v1/orders/${id}`);
};
