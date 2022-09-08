import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { ITermRequest, ITermResponse } from '@model/index';

export const termsApi = (params: ITermRequest): Promise<AxiosResponse<ITermResponse>> => {
  return Api.get('terms/v1/terms', { params });
};
