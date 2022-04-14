import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IPointResponse, IPointHistoriesResponse, IPointHistoriesRequest } from '@model/index';

export const getPointApi = (): Promise<AxiosResponse<IPointResponse>> => {
  return Api.get('point/v1/point');
};

export const getPointHistoryApi = (params: IPointHistoriesRequest): Promise<AxiosResponse<IPointHistoriesResponse>> => {
  return Api.get('point/v1/histories', { params });
};
