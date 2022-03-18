import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IGetOrderListRequest,
  IGetOrderListResponse,
  IGetOrderDetailResponse,
  IResponse,
  IEditOrderDestination,
} from '@model/index';

export const getOrderListsApi = ({
  days = 90,
  page = 1,
  size = 1,
  type,
}: IGetOrderListRequest): Promise<AxiosResponse<IGetOrderListResponse>> => {
  const params = {
    days,
    page,
    size,
    type,
  };
  return Api.get(`order/v1/orders/`, { params });
};

export const getOrderDetailApi = (id: number): Promise<AxiosResponse<IGetOrderDetailResponse>> => {
  return Api.get(`order/v1/orders/${id}`);
};

export const deleteDeliveryApi = (id: number): Promise<AxiosResponse<IResponse>> => {
  return Api.delete(`order/v1/deliveries/${id}`);
};

export const editDeliveryDestinationApi = (data: IEditOrderDestination): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`order/v1/deliveries`, data);
};
