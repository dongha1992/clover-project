import { getOrderDetailApi, getOrdersApi } from '@api/order';
import { IGetOrderListRequest } from '@model/index';
import { QueryKey, useQuery, UseQueryOptions } from 'react-query';

export const useGetOrders = (key: QueryKey, params: IGetOrderListRequest, options?: UseQueryOptions<any>) =>
  useQuery(
    key,
    async () => {
      const { data } = await getOrdersApi(params);
      return data.data;
    },
    options
  );

export const useGetOrderDetail = (key: QueryKey, id: number, options?: UseQueryOptions<any>) =>
  useQuery(
    key,
    async () => {
      const { data } = await getOrderDetailApi(id);
      data.data.orderDeliveries.sort(
        (a, b) => Number(a.deliveryDate.replaceAll('-', '')) - Number(b.deliveryDate.replaceAll('-', ''))
      );
      return data.data;
    },
    options
  );
