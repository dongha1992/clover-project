import { userChangeInfo, userProfile } from '@api/user';
import { MutationKey, QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';

export const useGetUserProfile = (key: QueryKey, options?: UseQueryOptions<any>) =>
  useQuery(
    key,
    async () => {
      const { data } = await userProfile();
      return data.data;
    },
    options
  );

export const useFatchUserProfile = (key: MutationKey, options?: UseMutationOptions<any>) =>
  useMutation(
    key,
    async (params: any) => {
      const { data } = await userChangeInfo(params);
      return data;
    },
    options
  );
