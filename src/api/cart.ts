import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IGetCartResponse } from '@model/index';

export const getCartsApi = (): Promise<AxiosResponse<IGetCartResponse>> => {
  return Api.get(`cart/v1/carts`);
};
