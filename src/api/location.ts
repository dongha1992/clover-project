import axios, { AxiosError, AxiosResponse } from 'axios';
import { handleHTTPError } from './errorHandle';
import { IKakaoAddress } from '@model/index';

export const KakaoApi = axios.create({
  baseURL: 'https://dapi.kakao.com',
  timeout: 10 * 1000,
  headers: {
    Authorization: 'KakaoAK afb3a1413cc8d2c864a74358105771a9',
    Accept: 'application/json',
  },
  responseType: 'json',
});

KakaoApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    return handleHTTPError(error as AxiosError);
  }
);

KakaoApi.interceptors.request.use((req) => {
  req.headers = {
    ...req.headers,
  };
  return req;
});

export const getLonLatFromAddress = (
  params: IKakaoAddress
): Promise<AxiosResponse<any>> => {
  return KakaoApi.get('/v2/local/search/address.json', {
    params,
  });
};

export const getPOIKeyword = (
  params: IKakaoAddress
): Promise<AxiosResponse<any>> => {
  return KakaoApi.get('/v2/local/search/keyword.json', {
    params,
  });
};
