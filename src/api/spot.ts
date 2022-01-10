import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IParamsSpots,
  ISpotsResponse,
  } from '@model/index';
  
  export const getNewSpots = (
    params: IParamsSpots
  ): Promise<AxiosResponse<ISpotsResponse>> => {
    return Api.get('/spot/v1/spots/new', { params });
  };

  export const getStationSpots = (
    params: IParamsSpots
  ): Promise<AxiosResponse<ISpotsResponse>> => {
    return Api.get('/spot/v1/spots/station', { params });
  };
