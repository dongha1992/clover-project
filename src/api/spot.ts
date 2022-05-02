import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IParamsSpots,
  ISpotsResponse,
  ISpotDetailResponse,
  ISpotDetailStoriesResponse,
  ISpotsInfoResponse,
  ISpotRegistrationsResponse,
  IParamsSpotRegisterationsOptios,
  ISpotRegisterationsOptiosResponse,
  IEditRegistration,
  IPostRegistrationResponse,
  IGetDestinationsRequest,
  IGetSpotsRegistrationsStatusResponse,
  ISpotWishListResponse,
  IGetSpotFilterResponse,
} from '@model/index';

//신규 스팟
export const getNewSpots = (params: IParamsSpots): Promise<AxiosResponse<ISpotsResponse>> => {
  return Api.get('/spot/v1/spots/new', { params });
};

// 역세권 스팟
export const getStationSpots = (params: IParamsSpots): Promise<AxiosResponse<ISpotsResponse>> => {
  return Api.get('/spot/v1/spots/station', { params });
};

// 스팟 상세
export const getSpotDetail = (id: number): Promise<AxiosResponse<ISpotDetailResponse>> => {
  return Api.get(`/spot/v1/spots/${id}`, { params: id });
};

// 이벤트 중인 스팟
export const getSpotEvent = (params: IParamsSpots): Promise<AxiosResponse<ISpotsResponse>> => {
  return Api.get('/spot/v1/spots/event', { params });
};

// 스팟 검색 _ 추천 스팟
export const getSpotSearchRecommend = (params: IParamsSpots): Promise<AxiosResponse<ISpotsResponse>> => {
  return Api.get('/spot/v1/spots/nearby', { params });
};

export const getSpotSearch = (params: IParamsSpots): Promise<AxiosResponse<ISpotsResponse>> => {
  return Api.get('/spot/v1/spots/search', { params });
};

// 근처 인기있는 스팟
export const getSpotPopular = (params: IParamsSpots): Promise<AxiosResponse<ISpotsResponse>> => {
  return Api.get('/spot/v1/spots/popular', { params });
};

export const getSpotsDetailStory = (id: number, page: number): Promise<AxiosResponse<ISpotDetailStoriesResponse>> => {
  return Api.get(`/spot/v1/spots/${id}/stories`, { params: { id, page } });
};

// 스팟 상세 스토리 좋아요 조회
export const getSpotsStoryLike = (spotId: number, storyId: number): Promise<AxiosResponse<ISpotDetailResponse>> => {
  return Api.get(`/spot/v1/spots/${spotId}/stories/${storyId}/like`, { params: { spotId, storyId } });
};

// 스팟 상세 스토리 좋아요 등록
export const postSpotsStoryLike = (spotId: number, storyId: number): Promise<AxiosResponse<ISpotDetailResponse>> => {
  return Api.post(`/spot/v1/spots/${spotId}/stories/${storyId}/like`, { params: { spotId, storyId } });
};

// 스팟 상세 스토리 좋아요 취소
export const deleteSpotsStoryLike = (spotId: number, storyId: number): Promise<AxiosResponse<ISpotDetailResponse>> => {
  return Api.delete(`/spot/v1/spots/${spotId}/stories/${storyId}/like`, { params: { spotId, storyId } });
};

// 스팟 좋아요 상태 조회
export const getSpotLike = (id: number): Promise<AxiosResponse<ISpotDetailResponse>> => {
  return Api.get(`/spot/v1/spots/${id}/like`, { params: id });
};

// 스팟 좋아요 등록
export const postSpotLike = (id: number): Promise<AxiosResponse<ISpotsResponse>> => {
  return Api.post(`/spot/v1/spots/${id}/like`, { params: id });
};

// 스팟 좋아요 취소
export const deleteSpotLike = (id: number): Promise<AxiosResponse<ISpotsResponse>> => {
  return Api.delete(`/spot/v1/spots/${id}/like`, { params: id });
};

// 스팟 정보 조회
export const getInfo = (): Promise<AxiosResponse<ISpotsInfoResponse>> => {
  return Api.get('/spot/v1/info');
};

// 근처 스팟 등록 신청 목록 조회
export const getSpotRegistrationsRecruiting = (
  params: IParamsSpots
): Promise<AxiosResponse<ISpotRegistrationsResponse>> => {
  return Api.get('/spot/v1/registrations/recruiting', { params });
};

// 스팟 등록 신청 참여
export const postSpotRegistrationsRecruiting = (id: number): Promise<AxiosResponse<ISpotsResponse>> => {
  return Api.post(`/spot/v1/registrations/${id}/recruiting`, { params: id });
};

// 스팟 등록 신청 옵션
export const getSpotRegisterationsOption = (
  params: IParamsSpotRegisterationsOptios
): Promise<AxiosResponse<ISpotRegisterationsOptiosResponse>> => {
  return Api.get(`/spot/v1/registrations/options`, { params });
};

//스팟 신청서 제출
export const postSpotsRegistrationsInfoSubmit = (
  data: IEditRegistration
): Promise<AxiosResponse<IPostRegistrationResponse>> => {
  return Api.post(`/spot/v1/registrations`, data);
};

// 스팟 등록 신청 조회
export const getSpotsRegistrationStatus = (
  params: IGetDestinationsRequest
): Promise<AxiosResponse<IGetSpotsRegistrationsStatusResponse>> => {
  return Api.get(`/spot/v1/registrations`, { params });
};

// 스팟 신청 현황 상세
export const getSpotsRegistrationStatusDetail = ( id: number): Promise<AxiosResponse<IEditRegistration>> => {
  return Api.get(`/spot/v1/registrations/${id}`, { params: id });
};

// 찜한 스팟
export const getSpotsWishList = (params: IParamsSpots): Promise<AxiosResponse<ISpotWishListResponse>> => {
  return Api.get(`/spot/v1/spots/like`, { params });
};

// 필터 정렬
export const getSpotsFilter = (): Promise<AxiosResponse<IGetSpotFilterResponse>> => {
  return Api.get('/spot/v1/spots/filters');
};
