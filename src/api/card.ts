import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IGetCardResponse, IRegisterCard, IRegisterCardResponse } from '@model/index';

export const getCardLists = (): Promise<AxiosResponse<IGetCardResponse>> => {
  return Api.get('card/v1/cards');
};

export const registerCard = (data: IRegisterCard): Promise<AxiosResponse<IRegisterCardResponse>> => {
  return Api.post('card/v1/cards', data);
};

export const setMainCard = (id: number): Promise<AxiosResponse<any>> => {
  return Api.post(`card/v1/cards/${id}/main`);
};

export const getMainCardLists = (): Promise<AxiosResponse<any>> => {
  return Api.get(`card/v1/cards/main`);
};

export const editCard = ({ id, name }: { id: number; name: string }): Promise<AxiosResponse<any>> => {
  return Api.patch(`card/v1/cards/${id}`, { name });
};

export const deleteCard = (id: number): Promise<AxiosResponse<any>> => {
  return Api.delete(`card/v1/cards/${id}`);
};
