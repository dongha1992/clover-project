import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie, removeCookie, setCookie } from '@utils/common';
import { userRefreshToken } from './authentication';
import router from 'next/router';
import { EventEmitter } from 'events';

const refreshTokenEvent = new EventEmitter();
const TOKEN_REFRESHED_EVENT = 'TOKEN_REFRESHED_EVENT';
let isTokenRefreshing = false;

export const onUnauthorized = () => {
  console.log('onUnauthorized');
  isTokenRefreshing = false;
  refreshTokenEvent.removeAllListeners(TOKEN_REFRESHED_EVENT);
  removeCookie({ name: 'acstk' });
  removeCookie({ name: 'refreshTokenObj' });
  //returnPath를 파라미터로 입력받아서 처리해야함.
  //returnPath=onboarding 이라면 로그인이후 다시 onboarding으로 이동됨.
  router.push(`/onboarding?returnPath=${encodeURIComponent(location.pathname)}`);
};

export const Api = axios.create({
  baseURL: process.env.API_URL,
});

export const retryApiInstance = axios.create({
  baseURL: process.env.API_URL,
});

const addPendingRequest = (config: AxiosRequestConfig) => {
  return new Promise((resolve) => {
    refreshTokenEvent.once(TOKEN_REFRESHED_EVENT, () => {
      const accessTokenObj = getCookie({ name: 'acstk' }) || {};
      config.headers!.Authorization = `Bearer ${accessTokenObj.accessToken}`;
      resolve(retryApiInstance(config));
    });
  });
};

const refreshToken = async () => {
  isTokenRefreshing = true;
  removeCookie({ name: 'acstk' });
  const refreshTokenObj = getCookie({ name: 'refreshTokenObj' });
  if (!refreshTokenObj) {
    return onUnauthorized();
  }
  console.log(refreshTokenObj.refreshToken, 'refreshTokenObj');
  try {
    const { data } = await userRefreshToken(refreshTokenObj.refreshToken);
    console.log(refreshTokenObj.refreshToken);
    const userTokenObj: any = data.data;

    const accessTokenObj = {
      accessToken: userTokenObj.accessToken,
      expiresIn: userTokenObj.expiresIn,
    };
    setCookie({
      name: 'acstk',
      value: JSON.stringify(accessTokenObj),
      option: {
        path: '/',
        maxAge: accessTokenObj.expiresIn,
      },
    });
    isTokenRefreshing = false;
    refreshTokenEvent.emit(TOKEN_REFRESHED_EVENT);
  } catch (e) {
    console.error(e);
    onUnauthorized();
  }
};

const onError = (error: AxiosError): Promise<never> => {
  return Promise.reject(error.response?.data);
};

Api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error) => {
    const { config, response } = error;
    console.log(config, 'config');
    console.log(response, 'response');
    console.log(error, 'error');

    try {
      if (response?.status === 401) {
        //EXPIRED_TOKEN(2110, "토큰이 만료되었습니다."),
        //INVALID_TOKEN(2111, "잘못된 토큰입니다."),
        console.log('status 401');
        const pendingRequest = addPendingRequest(config);
        if (!isTokenRefreshing) {
          refreshToken();
        }
        return pendingRequest;
      } else {
        return onError(error as AxiosError);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

Api.interceptors.request.use((req) => {
  const accessTokenObj = getCookie({ name: 'acstk' }) || {};
  req.headers!.Authorization = `Bearer ${accessTokenObj.accessToken}`;
  return req;
});
