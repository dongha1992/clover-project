import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IJusoRequest, IJusoResponse } from '@model/index';

export const userLogin = (
  data: IJusoRequest
): Promise<AxiosResponse<IJusoResponse>> => {
  return Api.post('user/v1/login', data);
};
