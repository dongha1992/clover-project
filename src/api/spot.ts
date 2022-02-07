import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IParamsSpots,
  ISpotsResponse,
  ISpotDetailResponse,
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

  export const getSpotDetail = (
    id: number
  ): Promise<AxiosResponse<ISpotDetailResponse>> => {
    return Api.get(`/spot/v1/spots/${id}`, {params: id});
  };

  export const getSpotEvent = (
    params: IParamsSpots
    ): Promise<AxiosResponse<ISpotsResponse>> => {
      return Api.get('/spot/v1/spots/event', { params });
  };

  export const getSpotSearchRecommend = (
    params: IParamsSpots
    ): Promise<AxiosResponse<ISpotsResponse>> => {
      return Api.get('/spot/v1/spots/nearby', { params });
  };

  export const getSpotSearch = (
    params: IParamsSpots
    ): Promise<AxiosResponse<ISpotsResponse>> => {
      return Api.get('/spot/v1/spots/search', { params });
  };
