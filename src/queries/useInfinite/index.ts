import { useInfiniteQuery, QueryFunction, QueryKey } from 'react-query';

export const useInfinite = (key: QueryKey, fetchDatas: QueryFunction) => {
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
