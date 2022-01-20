import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IParamsSpots,
  ISpotsResponse,
  ISpotDetailResponse,
  ISpotDetailStoriesResponse,
  ISpotsInfoResponse,
  ISpotRegistrationsResponse,
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

  export const getSpotsStoryLike = (
    spotId: number,
    storyId: number,
    ): Promise<AxiosResponse<ISpotDetailResponse>> => {
      return Api.get(`/spot/v1/spots/${spotId}/stories/${storyId}/like`, { params: { spotId, storyId } });
  };

  export const postSpotsStoryLike = (
    spotId: number,
    storyId: number,
    ): Promise<AxiosResponse<ISpotDetailResponse>> => {
      return Api.post(`/spot/v1/spots/${spotId}/stories/${storyId}/like`, { params: { spotId, storyId } });
  };

  export const deleteSpotsStoryLike = (
    spotId: number,
    storyId: number,
    ): Promise<AxiosResponse<ISpotDetailResponse>> => {
      return Api.delete(`/spot/v1/spots/${spotId}/stories/${storyId}/like`, { params: { spotId, storyId } });
  };

  export const getSpotLike = (
    id: number,
    ): Promise<AxiosResponse<ISpotDetailResponse>> => {
      return Api.get(`/spot/v1/spots/${id}/like`, { params: id });
  };

  export const postSpotLike = (
    id: number,
    ): Promise<AxiosResponse<ISpotsResponse>> => {
      return Api.post(`/spot/v1/spots/${id}/like`, { params: id });
  };  
  
  export const deleteSpotLike = (
    id: number,
    ): Promise<AxiosResponse<ISpotsResponse>> => {
      return Api.delete(`/spot/v1/spots/${id}/like`, { params: id });
  };

  export const getInfo = (
    ): Promise<AxiosResponse<ISpotsInfoResponse>> => {
      return Api.get('/spot/v1/info');
  };

  export const getSpotRegistrations = (
    params: IParamsSpots,
    ): Promise<AxiosResponse<ISpotRegistrationsResponse>> => {
      return Api.get('/spot/v1/registrations/recruiting', { params });
  };

  export const postSpotRegistrations = (
    id: number,
    ): Promise<AxiosResponse<ISpotsResponse>> => {
      return Api.post(`/spot/v1/registrations/${id}/recruiting`, { params: id });
  };
