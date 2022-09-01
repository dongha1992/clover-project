import { getNotiInfoApi, getNotisApi, postNotiCheckApi } from '@api/notification';
import { TNotiType } from '@model/index';
import {
  MutationKey,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from 'react-query';

export const useGetNotiInfo = (key: QueryKey, options?: UseQueryOptions<any>) =>
  useQuery(
    key,
    async () => {
      const { data } = await getNotiInfoApi();
      return data.data.uncheckedCount;
    },
    options
  );

export const usePostNotiCheck = (key: MutationKey, options?: UseMutationOptions<any>) =>
  useMutation(
    key,
    async (id: any) => {
      const res = await postNotiCheckApi(id);
      return res;
    },
    options
  );

export const useInfiniteNotis = ({ key, size, type }: { key: QueryKey; size: number; type?: TNotiType }) => {
  const fetchDatas = async ({ pageParam = 1 }) => {
    const { data } = await getNotisApi({ page: pageParam, size, type });
    return {
      result: data.data.notifications,
      nextPage: pageParam + 1,
      totalPage: data.data.pagination.totalPage,
    };
  };
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
