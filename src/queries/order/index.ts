import { getOrderDetailApi } from '@api/order';
import { QueryKey, useQuery, UseQueryOptions } from 'react-query';

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
