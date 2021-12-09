// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from 'next'

// type Data = {
//   name: string
// }

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }

import axios from 'axios';
import { CLOVER_URL } from '@constants/mock';
import { getCookie } from '@utils/cookie';
import {
  ISendRequestApi,
  ISendRequestForDataApi,
  IFetchApi,
  IAddApi,
  ISignIn,
  IkakaoLogin,
  IConfimTel,
  IAuthTel,
  IAavilabiltyEmail,
  ISignupUser,
  ILogin,
} from '@model/index';

// fetch, remove
const sendRequest = async ({ url, params, method }: ISendRequestApi) => {
  const headers = {
    // Authorization: getCookie({ name: 'authuser' }),
  };

  try {
    const res = await axios[method](CLOVER_URL + url, {
      headers,
      params,
    });
    console.log(res, 'RESPONSE');
    if (res.status === 200 && !res.data.error) {
      return res.data;
    }
    alert(res.data.error.message);
    console.log(
      `error-code : ${res.data.error.status}, message : ${res.data.error.message}`
    );
    return;
  } catch (error) {
    console.log(error);
  }
  return null;
};

// add, edit
const sendRequestForData = async ({
  url,
  data,
  method,
}: ISendRequestForDataApi) => {
  try {
    const res = await axios[method](CLOVER_URL + url, data);
    console.log(res, 'REQUEST');
    if (res.status === 200 && !res.data.error) {
      return res.data;
    }
    alert(res.data.error.message);
    console.log(
      `error-code : ${res.data.error.status}, message : ${res.data.error.message}`
    );
    return;
  } catch (error) {
    console.log(error);
  }
  return null;
};

const fetch = ({ url, params }: IFetchApi) =>
  sendRequest({ url, params, method: 'get' });

const add = ({ url, data }: IAddApi) =>
  sendRequestForData({ url, data, method: 'post' });

// const remove = (url, params) => sendRequest(url, params, 'delete');

// const edit = (url, data) => sendRequestForData(url, data, 'put');

export const Api = {
  addKakaoLogin: (data: IkakaoLogin) =>
    add({ url: '/user/v1/signin-kakao', data }),
  addSignIn: (data: ISignIn) => add({ url: '/user/v1/signin-email', data }),
  addAuthTel: (data: IAuthTel) => add({ url: '/user/v1/auth/tel', data }),
  addConfirmTel: (data: IConfimTel) =>
    add({ url: '/user/v1/confirm/tel', data }),
  fetchAvailabilityEmail: (params: IAavilabiltyEmail) =>
    fetch({ url: '/user/v1/availability/email', params }),
  addSignup: (data: ISignup) => add({ url: '/user/v1/users', data }),
  addLogin: (data: ILogin) => add({ url: 'user/v1/login', data }),
};
