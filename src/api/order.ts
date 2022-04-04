import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IGetOrderListRequest,
  IGetOrderListResponse,
  IGetOrderDetailResponse,
  IResponse,
  IEditOrderDestination,
  IEditOrderSpotDestination,
  IGetSubOrdersResponse,
  IOrderPreviewRequest,
  ICreateOrderPreviewResponse,
  ICreateOrderResponse,
} from '@model/index';

export const createOrderApi = (data: any): Promise<AxiosResponse<ICreateOrderResponse>> => {
  return Api.post(`order/v1/orders`, data);
};

export const createOrderPreviewApi = (
  data: IOrderPreviewRequest
): Promise<AxiosResponse<ICreateOrderPreviewResponse>> => {
  return Api.post(`order/v1/orders/preview`, data);
};

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
  return Api.get(`order/v1/deliveries/`, { params });
};

export const getOrderDetailApi = (id: number): Promise<AxiosResponse<IGetOrderDetailResponse>> => {
  return Api.get(`order/v1/orders/${id}`);
};

export const deleteDeliveryApi = (id: number): Promise<AxiosResponse<IResponse>> => {
  return Api.delete(`order/v1/deliveries/${id}`);
};

export const editDeliveryDestinationApi = ({
  data,
  deliveryId,
}: {
  data: IEditOrderDestination;
  deliveryId: number;
}): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`order/v1/deliveries/${deliveryId}/destination`, data);
};

export const editSpotDestinationApi = ({
  deliveryId,
  data,
}: {
  data: IEditOrderSpotDestination;
  deliveryId: number;
}): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`order/v1/deliveries/${deliveryId}/pickup`, data);
};

export const editDeliveryDateApi = ({
  deliveryId,
  selectedDeliveryDay,
}: {
  selectedDeliveryDay: string;
  deliveryId: number;
}): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`order/v1/deliveries/${deliveryId}/date`, { deliveryDate: selectedDeliveryDay });
};

export const getSubOrdersCheckApi = (): Promise<AxiosResponse<IGetSubOrdersResponse>> => {
  return Api.get(`order/v1/deliveries/together`);
};
