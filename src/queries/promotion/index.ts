import {
  MutationKey,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from 'react-query';
import { getExhibitionApi } from '@api/promotion';

export const useInfiniteExhibitionList = ({ page, size }: { size: number; page: number }) => {
    const fetchDatas = async ({ pageParam = 1 }) => {
      const { data } = await getExhibitionApi({ page: pageParam, size });
  
      return {
        result: data.data.exhibitions,
        nextPage: pageParam + 1,
        totalPage: data.data.pagination?.totalPage,
      };
    };

    const query = useInfiniteQuery('infiniteExhibition', fetchDatas, {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.totalPage! >= lastPage.nextPage) {
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
  
    return query;
  };
  