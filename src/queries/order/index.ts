import { deleteOrderCancelApi, deleteOrderCancelPreviewApi, getOrderDetailApi, getOrdersApi } from '@api/order';
import { IGetOrderRequest, IGetOrders, IOrderDeliverie } from '@model/index';
import {
  MutationKey,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from 'react-query';
import { useInfinite } from '@queries/useInfinite';

export const useGetOrders = (key: QueryKey, params: IGetOrderRequest, options?: UseQueryOptions<any>) =>
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

export const useInfiniteOrders = ({ days, size, type }: { days: number; size: number; type: string }) => {
  const fetchDatas = async ({ pageParam = 1 }) => {
    const { data } = await getOrdersApi({ days: days, page: pageParam, size: size, type: type });
    data.data.orders.map((item: IGetOrders) => {
      item.orderDeliveries.sort(
        (a: IOrderDeliverie, b: IOrderDeliverie) =>
          Number(a.deliveryDate?.replaceAll('-', '')) - Number(b.deliveryDate?.replaceAll('-', ''))
      );
      return item;
    });

    return {
      result: data.data.orders,
      nextPage: pageParam + 1,
      totalPage: data.data.pagination.totalPage,
    };
  };

  return useInfinite('orders', fetchDatas);
};
