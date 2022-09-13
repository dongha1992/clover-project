import { hide } from '@store/loading';
import { useInfiniteQuery, QueryFunction, QueryKey } from 'react-query';
import { useDispatch } from 'react-redux';

export const useInfinite = (key: QueryKey, fetchDatas: QueryFunction, enabled?: string) => {
  const dispatch = useDispatch();
  return useInfiniteQuery(key, fetchDatas, {
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage.totalPage >= lastPage.nextPage) {
        return lastPage.nextPage;
      } else {
        return null;
      }
    },
    onSettled: () => {
      dispatch(hide());
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
    cacheTime: 0,
    staleTime: 0,
  });
};
