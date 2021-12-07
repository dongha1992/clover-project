export type Obj<T = any> = {
  [k: string]: T;
};

export declare type Cookie = any;

export interface CookieSetOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'none' | 'lax' | 'strict';
  encode?: (value: string) => string;
}

export interface ISetCookie {
  name: string;
  value: string;
  option?: CookieSetOptions;
}

export interface IGetCookie {
  name: string;
}

export interface IRemoveCookie {
  name: string;
}

export interface ILayoutChildren {
  children: any;
}

type Method = 'get' | 'delete' | 'put' | 'post';

/*TODO: params type 정의 다시  */

export interface ISendRequestApi {
  url?: string;
  params?: any;
  method: Method;
}

export interface IFetchApi {
  url?: string;
  params?: any;
}

export interface ISendRequestForDataApi {
  url?: string;
  data?: any;
  method: Method;
}

export interface IAddApi {
  url?: string;
  data?: any;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface IkakaoLogin {
  accessToken: string;
  tokenType: string;
}

export interface IConfimTel {
  authCode: string;
  tel: string;
}

export interface IAuthTel {
  tel: string;
}

export interface IAavilabiltyEmail {
  email: string;
}

export interface ISignup {
  authCode: string;
  birthDate: string;
  email: string;
  emailReceived: boolean;
  gender: string;
  name: string;
  nickname: string;
  password: string;
  smsReceived: boolean;
  tel: string;
}
