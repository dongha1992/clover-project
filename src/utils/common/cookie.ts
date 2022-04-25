import { Cookies } from 'react-cookie';
import { ISetCookie, IGetCookie, IRemoveCookie } from '@model/index';

const cookies = new Cookies();

const setCookie = ({ name, value, option }: ISetCookie) => cookies.set(name, value, { ...option });

const getCookie = ({ name }: IGetCookie) => cookies.get(name);

const removeCookie = ({ name }: IRemoveCookie) => cookies.remove(name);

export { setCookie, getCookie, removeCookie };
