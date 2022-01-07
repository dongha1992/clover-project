import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
    IParamsNewSpots,
    INewSpotsResponse,
  } from '@model/index';
  
  export const getNewSpots = (
    params: IParamsNewSpots
  ): Promise<AxiosResponse<INewSpotsResponse>> => {
    return Api.get('/spot/v1/spots/new', { params });
  };