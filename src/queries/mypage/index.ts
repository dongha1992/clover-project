import { IMenus } from '@model/index';
import {
  MutationKey,
  QueryKey,
  useInfiniteQuery,
  QueryFunction,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from 'react-query';

import { getOrderListsApi } from '@api/order';

const useInfinite = (key: string, fetchDatas: QueryFunction) => {
  return useInfiniteQuery(key, fetchDatas, {
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage.totalPage >= lastPage.nextPage) {
        return lastPage.nextPage;
      } else {
        return null;
      }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
    cacheTime: 0,
    staleTime: 0,
  });
};

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

  // const query = useInfiniteQuery('infinite', fetchDatas, {
  //   getNextPageParam: (lastPage, pages) => {
  //     if (lastPage.totalPage >= lastPage.nextPage) {
  //       return lastPage.nextPage;
  //     } else {
  //       return null;
  //     }
  //   },
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: true,
  //   retry: 1,
  //   cacheTime: 0,
  //   staleTime: 0,
  // });

  // return query;
};
