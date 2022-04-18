import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { ICouponResponse } from '@model/index';

export const getCouponApi = (): Promise<AxiosResponse<ICouponResponse>> => {
  return Api.get('coupon/v1/coupons');
};
