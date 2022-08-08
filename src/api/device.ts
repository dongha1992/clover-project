import { IDeviceRequest, IResponse } from '@model/index';
import { AxiosResponse } from 'axios';
import { Api } from './Api';

export const putDeviceApi = (data: IDeviceRequest): Promise<AxiosResponse<any>> => {
  return Api.put('/device/v1/devices', data);
};
