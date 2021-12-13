import axios, { AxiosError, AxiosResponse } from 'axios';
import { CLOVER_URL } from '@constants/mock';
import cloneDeep from 'lodash-es/cloneDeep';
import { getCookie } from '@utils/cookie';
import { userRefreshToken } from '../v2';

let isTokenRefreshing = false;
let refreshSubscribers: any[] = [];

const onTokenRefreshed = (accessToken: string) => {
  console.log('onTokenRefreshed COUNT', refreshSubscribers.length);
  refreshSubscribers.map((callback) => {
    callback(accessToken);
  });

  while (refreshSubscribers.length) {
    refreshSubscribers.pop();
  }
};

const addRefreshSubscriber = (callback: any) => {
  refreshSubscribers.push(callback);
};

export const Api = axios.create({
  baseURL: CLOVER_URL,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});

Api.interceptors.response.use(
  (res: AxiosResponse) => {
    console.log(res, 'res');
    return res;
  },
  async (error) => {
    const { config, response } = error;
    let pendingRequest = config;
    console.log(config, 'config');
    console.log(response, 'response');
    console.log(error, 'error');
    if (response.status === 401) {
      console.log('status 401');

      if (!isTokenRefreshing) {
        console.log('## I response TokenRefreshing');
        isTokenRefreshing = true;
        const refreshTokenObj = getCookie({ name: 'refreshTokenObj' });
        console.log(refreshTokenObj.refreshToken, 'refreshTokenObj');

        const { data } = await userRefreshToken(refreshTokenObj.refreshToken);
        console.log(refreshTokenObj.refreshToken);
        const userTokenObj: any = data.data;

        const accessTokenObj = {
          accessToken: userTokenObj.accessToken,
          expiresIn: userTokenObj.expiresIn,
        };

        sessionStorage.setItem('accessToken', JSON.stringify(accessTokenObj));

        isTokenRefreshing = false;
        onTokenRefreshed(userTokenObj.accessToken);
        return Api(pendingRequest);
      } else {
        return new Promise((resolve) => {
          addRefreshSubscriber((accessToken: string) => {
            pendingRequest.headers.Authorization = `Bearer ${accessToken}`;
            return resolve(Api(pendingRequest));
          });
        });
      }
    }
    console.log(response, 'response');
    return onError(error as AxiosError);
  }
);

Api.interceptors.request.use((req) => {
  const request = cloneDeep(req);

  const accessTokenObj =
    JSON.parse(sessionStorage.getItem('accessToken') ?? '{}') ?? '';

  request.headers = {
    ...req.headers,

    Authorization: `Bearer ${accessTokenObj.accessToken}`,
  };
  console.log(request, 'req');
  return request;
});

export const onError = async (error: AxiosError): Promise<never> => {
  const { status } = (error.response as AxiosResponse) || 500;

  return Promise.reject(error);
};
