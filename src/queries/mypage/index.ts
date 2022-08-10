import { useInfiniteQuery, QueryFunction } from 'react-query';
import { getOrderListsApi } from '@api/order';
import { useInfinite } from '@queries/useInfinite';

export const useInfiniteOrderList = ({
  withInDays,
  orderType,
  page,
  size,
}: {
  withInDays: string;
  orderType: string;
  size: number;
  page: number;
}) => {
  const fetchDatas = async ({ pageParam = 1 }) => {
    const params = {
      days: Number(withInDays),
      page: pageParam,
      size,
      orderType,
    };

    const { data } = await getOrderListsApi(params);

    return {
      result: data.data.orderDeliveries,
      nextPage: pageParam + 1,
      totalPage: data.data.pagination.totalPage,
    };
  };

  return useInfinite('infiniteOrderList', fetchDatas);
};
