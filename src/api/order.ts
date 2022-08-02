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
  ICreateOrderRequest,
  IGetOrderInfoResponse,
  IGetKakaoPaymentResponse,
  IGetNicePaymentResponse,
  IGetPaycoRequest,
  IGetPaycoPaymentResponse,
  IGetTossPaymentResponse,
  IDeleteOrderCancelPreviewResponse,
  IGetOrderRequest,
  IGetOrdersResponse,
} from '@model/index';

export const getOrderInfoApi = (params: { orderType: string }): Promise<AxiosResponse<IGetOrderInfoResponse>> => {
  return Api.get(`order/v1/deliveries/info`, { params });
};

export const createOrderApi = (data: ICreateOrderRequest): Promise<AxiosResponse<ICreateOrderResponse>> => {
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
  orderType,
}: IGetOrderListRequest): Promise<AxiosResponse<IGetOrderListResponse>> => {
  const params = {
    days,
    page,
    size,
    orderType,
  };
  return Api.get(`order/v1/deliveries`, { params });
};

export const getOrdersApi = ({
  days = 90,
  page = 1,
  size = 1,
  type,
}: IGetOrderRequest): Promise<AxiosResponse<IGetOrdersResponse>> => {
  const params = {
    days,
    page,
    size,
    type,
  };
  return Api.get('order/v1/orders', { params });
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
  console.log(deliveryId, 'deliveryId');
  return Api.post(`order/v1/deliveries/${deliveryId}/date`, { deliveryDate: selectedDeliveryDay });
};

export const getSubOrdersCheckApi = ({
  delivery,
}: {
  delivery: string;
}): Promise<AxiosResponse<IGetSubOrdersResponse>> => {
  return Api.get(`order/v1/deliveries/together`, { params: { delivery } });
};

/* pg */

export const postKakaoApproveApi = ({
  orderId,
  data,
}: {
  orderId: number;
  data: { pgToken: string; tid: string };
}): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`order/v1/orders/${orderId}/kakaopay-approve`, data);
};

export const postKakaoPaymentApi = ({
  orderId,
  data,
}: {
  orderId: number;
  data: { cancelUrl: string; failureUrl: string; successUrl: string };
}): Promise<AxiosResponse<IGetKakaoPaymentResponse>> => {
  return Api.post(`order/v1/orders/${orderId}/kakaopay-payment`, data);
};

export const postNiceApproveApi = ({
  orderId,
  params,
}: {
  orderId: number;
  params: { failureUrl: string; successUrl: string };
}): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`order/v1/orders/${orderId}/nicepay-approve`, { params });
};

export const postNicePaymnetApi = ({
  orderId,
  data,
}: {
  orderId: number;
  data: { failureUrl: string; successUrl: string; payMethod: string };
}): Promise<AxiosResponse<IGetNicePaymentResponse>> => {
  return Api.post(`order/v1/orders/${orderId}/nicepay-payment`, data);
};

export const getPaycoApprove = ({ params }: { params: IGetPaycoRequest }): Promise<AxiosResponse<IResponse>> => {
  /* TODO: test 요망 */
  const { id } = { ...params };

  return Api.get(`order/v1/orders/${id}/payco-approve`, { params });
};

export const postPaycoPaymentApi = ({
  orderId,
  data,
}: {
  orderId: number;
  data: { cancelUrl: string; failureUrl: string; successUrl: string };
}): Promise<AxiosResponse<IGetPaycoPaymentResponse>> => {
  return Api.post(`order/v1/orders/${orderId}/payco-payment`, data);
};

export const postTossApproveApi = ({
  orderId,
  data,
}: {
  orderId: number;
  data: {
    payToken: number;
  };
}): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`order/v1/orders/${orderId}/toss-approve`, data);
};

export const postTossPaymentApi = ({
  orderId,
  data,
}: {
  orderId: number;
  data: { failureUrl: string; successUrl: string };
}): Promise<AxiosResponse<IGetTossPaymentResponse>> => {
  return Api.post(`order/v1/orders/${orderId}/toss-payment`, data);
};

export const postOrderCardChangeApi = ({
  orderId,
  cardId,
}: {
  cardId: any;
  orderId: any;
}): Promise<AxiosResponse<IResponse>> => {
  return Api.post(`order/v1/orders/${orderId}/card`, { cardId: cardId });
};

export const deleteOrderCancelApi = (id: number): Promise<AxiosResponse<IResponse>> => {
  return Api.delete(`/order/v1/orders/${id}`);
};
export const deleteOrderCancelPreviewApi = (id: number): Promise<AxiosResponse<IDeleteOrderCancelPreviewResponse>> => {
  return Api.delete(`/order/v1/orders/${id}/preview`);
};
