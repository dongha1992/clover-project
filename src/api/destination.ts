import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IRegisterDestinationRequest,
  IRegisterDestinationResponse,
  IResponse,
  IAvilabiltyAddress,
  IAvilabiltyAddressResponse,
  IGetDestinationsResponse,
  IEditDestinationRequest,
  IGetDestinationsRequest,
  IGetMainDestinationsRequest,
  IGetMainDestinationsResponse,
} from '@model/index';

export const getAvailabilityDestinationApi = (
  params: IAvilabiltyAddress
): Promise<AxiosResponse<IAvilabiltyAddressResponse>> => {
  return Api.get('destination/v1/availability/address', { params });
};

export const getDestinationsApi = (
  params: IGetDestinationsRequest
): Promise<AxiosResponse<IGetDestinationsResponse>> => {
  return Api.get('destination/v1/destinations', { params });
};

export const postDestinationApi = (
  data: IRegisterDestinationRequest
): Promise<AxiosResponse<IRegisterDestinationResponse>> => {
  return Api.post('destination/v1/destinations', data);
};

export const editDestinationApi = (id: number, data: IEditDestinationRequest): Promise<AxiosResponse<IResponse>> => {
  return Api.put(`destination/v1/destinations/${id}`, data);
};

export const deleteDestinationsApi = (id: number): Promise<AxiosResponse<IResponse>> => {
  return Api.delete(`destination/v1/destinations/${id}`, { params: id });
};

export const getMainDestinationsApi = (
  params: IGetMainDestinationsRequest
): Promise<AxiosResponse<IGetMainDestinationsResponse>> => {
  return Api.get('destination/v1/destinations/main', { params });
};

export const patchMainDestinationsApi = (id: number, delivery: string): Promise<AxiosResponse<IResponse>> => {
  return Api.patch(`destination/v1/destinations/${id}/main`, {
    params: { id, delivery },
  });
};
