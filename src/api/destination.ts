import { AxiosResponse } from 'axios';
import { Api } from './Api';
import {
  IRegisterDestination,
  IResponse,
  IAvilabiltyAddress,
  IAvilabiltyAddressResponse,
  IGetDestinationsResponse,
  IEditDestination,
  IGetDestinations,
  IGetMainDestinationsResponse,
} from '@model/index';

export const availabilityDestination = (
  params: IAvilabiltyAddress
): Promise<AxiosResponse<IAvilabiltyAddressResponse>> => {
  return Api.get('destination/v1/availability/address', { params });
};

export const getDestinations = (
  params: IGetDestinations
): Promise<AxiosResponse<IResponse>> => {
  return Api.get('destination/v1/destinations', { params });
};

export const destinationRegister = (
  data: IRegisterDestination
): Promise<AxiosResponse<IResponse>> => {
  console.log(data);
  return Api.post('destination/v1/destinations', data);
};

export const editDestination = (
  id: number,
  data: IEditDestination
): Promise<AxiosResponse<IResponse>> => {
  return Api.put(`destination/v1/destinations/${id}`, data);
};

export const deleteDestinations = (
  id: number
): Promise<AxiosResponse<IResponse>> => {
  return Api.delete(`destination/v1/destinations/${id}`, { params: id });
};

export const getMainDestinations = (
  delivery: string
): Promise<AxiosResponse<IGetMainDestinationsResponse>> => {
  return Api.get('destination/v1/destinations/main', { params: delivery });
};

export const setMainDestinations = (
  id: number,
  delivery: string
): Promise<AxiosResponse<IResponse>> => {
  return Api.patch(`destination/v1/destinations/${id}/main`, {
    params: { id, delivery },
  });
};
