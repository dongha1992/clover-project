import axios, { AxiosError, AxiosResponse } from 'axios';
import { IJusoRequest, IJusoResponse } from '@model/index';

export const JusoApi = axios.create({
  baseURL: 'https://www.juso.go.kr',
  timeout: 10 * 1000,
  headers: {
    accept: 'application/json',
    'Content-Type': 'text/plain',
  },
  responseType: 'json',
});

JusoApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    return onError(error as AxiosError);
  }
);

JusoApi.interceptors.request.use((req) => {
  req.headers = {
    ...req.headers,
  };
  return req;
});

const onError = (error: AxiosError): Promise<never> => {
  const { status } = (error.response as AxiosResponse) || 500;
  if (status < 500) {
    console.log(status, error);
  }
  if (status >= 500) {
    console.log(status, error);
  }
  return Promise.reject(error);
};

export const searchAddressJuso = (
  params: IJusoRequest
): Promise<AxiosResponse<IJusoResponse>> => {
  return JusoApi.post(
    '/addrlink/addrLinkApi.do',
    {},
    {
      params: {
        confmKey: 'U01TX0FVVEgyMDIxMTExOTExMzQ0NDExMTkxMTY=',
        countPerPage: 20,
        currentPage: params.page,
        resultType: 'json',
        hstryYn: 'Y',
        keyword: params.query,
      },
    }
  );
};
