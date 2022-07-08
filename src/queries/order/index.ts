import { deleteOrderCancelApi, deleteOrderCancelPreviewApi, getOrderDetailApi, getOrdersApi } from '@api/order';
import { IGetOrderListRequest } from '@model/index';
import { MutationKey, QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';

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

export const useDeleteOrderCancelPreview = (key: QueryKey, id: number, options?: UseQueryOptions<any>) =>
  useQuery(
    key,
    async () => {
      const { data } = await deleteOrderCancelPreviewApi(id);
      return data.data;
    },
    options
  );

export const useDeleteOrderCancel = (key: MutationKey, options?: UseMutationOptions<any>) =>
  useMutation(
    key,
    async (id: any) => {
      const res = deleteOrderCancelApi(id);
      return res;
    },
    options
  );
