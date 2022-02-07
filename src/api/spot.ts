import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IParamsSpots,
  ISpotsResponse,
  ISpotDetailResponse,
  ISpotDetailStoriesResponse,
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
    return Api.get(`/spot/v1/spots/${id}`, { params: id });
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

  export const getSpotPopular = (
    params: IParamsSpots
    ): Promise<AxiosResponse<ISpotsResponse>> => {
      return Api.get('/spot/v1/spots/popular', { params });
  };

  export const getSpotsDetailStory = (
    id: number,
    page: number,
    ): Promise<AxiosResponse<ISpotDetailStoriesResponse>> => {
      return Api.get(`/spot/v1/spots/${id}/stories`, { params: { id, page } });
  };




  // export const getInfo = (
  //   params: IParamsSpots
  //   ): Promise<AxiosResponse<ISpotsResponse>> => {
  //     return Api.get('/spot/v1/info', { params });
  // };

