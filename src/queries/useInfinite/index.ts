import { useInfiniteQuery, QueryFunction } from 'react-query';

export const useInfinite = (key: string, fetchDatas: QueryFunction) => {
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
