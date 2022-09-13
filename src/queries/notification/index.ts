import { getNotiInfoApi, getNotisApi, postNotiCheckApi } from '@api/notification';
import { TNotiType } from '@model/index';
import { hide, show } from '@store/loading';
import {
  MutationKey,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from 'react-query';
import { useDispatch } from 'react-redux';

export const useGetNotiInfo = (key: QueryKey, options?: UseQueryOptions<any>) => {
  const dispatch = useDispatch();

  return useQuery(
    key,
    async () => {
      dispatch(show());
      const { data } = await getNotiInfoApi();
      return data.data.uncheckedCount;
    },
    options
  );
};

export const usePostNotiCheck = (key: MutationKey, options?: UseMutationOptions<any>) =>
  useMutation(
    key,
    async (id: any) => {
      const res = await postNotiCheckApi(id);
      return res;
    },
    options
  );

export const useInfiniteNotis = ({
  key,
  size,
  type,
  onSuccess,
}: {
  key: QueryKey;
  size: number;
  type?: TNotiType;
  onSuccess?: any;
}) => {
  const dispatch = useDispatch();
  const fetchDatas = async ({ pageParam = 1 }) => {
    dispatch(show());
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
    onSettled: () => {
      dispatch(hide());
    },
    onSuccess,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
    cacheTime: 0,
    staleTime: 0,
  });
};
