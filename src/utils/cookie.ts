import { Cookies } from 'react-cookie';
import { ISetCookie, IGetCookie, IRemoveCookie } from '@model/index';

const cookies = new Cookies();

export const setCookie = ({ name, value, option }: ISetCookie) =>
  cookies.set(name, value, { ...option });

export const getCookie = ({ name }: IGetCookie) => cookies.get(name);

export const removeCookie = ({ name }: IRemoveCookie) => cookies.remove(name);
