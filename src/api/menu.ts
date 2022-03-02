import { AxiosResponse } from 'axios';
import { Api } from './Api';
import { IGetMenus, IGetMenusResponse } from '@model/index';

export const getMenusApi = (params: IGetMenus): Promise<AxiosResponse<IGetMenusResponse>> => {
  return Api.get(`menu/v1/menus/`, { params });
};

export const getMenuApi = (id: number): Promise<AxiosResponse<any>> => {
  return Api.get(`menu/v1/menus/${id}`);
};
