import axios, { AxiosError, AxiosResponse } from 'axios';
import { CLOVER_URL } from '@constants/mock';
import cloneDeep from 'lodash-es/cloneDeep';
import { getCookie } from '@utils/cookie';
import { refreshToken } from '../v2';

export const Api = axios.create({
  baseURL: CLOVER_URL,
});

Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    return onError(error as AxiosError);
  }
);

Api.interceptors.request.use((req) => {
  const request = cloneDeep(req);

  request.headers = {
    ...req.headers,

    // Authorization: getCookie({ name: 'refreshTokenObj' }).refreshToken ?? '',
    // Authorization: JSON.parse(sessionStorage.getItem('accessToken') ?? ''),
  };
  return request;
});

export const onError = async (error: AxiosError): Promise<never> => {
  const { status } = (error.response as AxiosResponse) || 500;
  if (status === 401 || status === 403) {
    console.log('need refresh');
    const refreshToken =
      getCookie({ name: 'refreshTokenObj' }).refreshToken ?? '';
    if (refreshToken) {
      const data = await refreshToken(refreshToken);
      console.log(data, 'after refresh');
    }
  }
  return Promise.reject(error);
};
