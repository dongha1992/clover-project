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
/*TODO: params type 정의 다시  */

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

export interface ISignupUser {
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

export interface IUser {
  id: number;
  birthDate: string;
  email: string;
  emailReceived: boolean;
  gender: string;
  name: string;
  nickname: string;
  password: string;
  smsReceived: boolean;
  tel: string;
  point: number;
  emailConfirmed: boolean;
  telConfirmed: boolean;
  smsDenied: boolean;
  promotionCode: string;
  promotionCount: number;
  recommendCode: boolean;
  joinType: string;
  createdAt: string;
}

export interface ILogin {
  accessToken?: string;
  email: string;
  loginType: string;
  password: string;
}

export interface IResponse {
  code: number;
  message: string;
}

export interface IUserToken {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  tokenType: string;
  tmpPasswordUsed?: boolean;
}
export interface ILoginResponse {
  code: number;
  message: string;
  data?: IUserToken;
}

export interface ISignupResponse {
  code: number;
  message: string;
  data?: IUserToken;
}

export interface IConfirmTelResponse {
  code: number;
  message: string;
  data: {
    availability: boolean;
  };
}

export interface IHelpEmail {
  name: string;
  tel: string;
}

export interface IHelpPassword {
  email: string;
  tel: string;
}

export interface IChangePassword {
  newPassword: string;
  oldPassword?: string;
}

export interface IJusoRequest {
  query: string;
  page: number;
}

export interface IJusoResponse {
  results: {
    common: ICommon;
    juso: Array<IJuso>;
  };
}

export interface IAddress {
  readonly zipCode: string | null;
  readonly roadAddress: string | null;
  readonly buildName: string | null;
  readonly jibunAddress: string | null;
}

export interface IJuso {
  readonly roadAddr: string | null;
  readonly roadAddrPart1: string | null;
  readonly roadAddrPart2: string | null;
  readonly jibunAddr: string | null;
  readonly engAddr: string | null;
  readonly zipNo: string | null;
  readonly admCd: string | null;
  readonly rnMgtSn: string | null;
  readonly bdMgtSn: string | null;
  readonly detBdNmList: string | null;
  readonly bdNm: string | null;
  readonly bdKdcd: string | null;
  readonly siNm: string | null;
  readonly sggNm: string | null;
  readonly emdNm: string | null;
  readonly liNm: string | null;
  readonly rn: string | null;
  readonly udrtYn: string | null;
  readonly buldMnnm: string | null;
  readonly buldSlno: string | null;
  readonly mtYn: string | null;
  readonly lnbrMnnm: string | null;
  readonly lnbrSlno: string | null;
  readonly emdNo: string | null;
}

export interface ICommon {
  totalCount: string;
  currentPage: string;
  countPerPage: string;
  errorCode: string;
  errorMessage: string;
}

export type TDeliveryType = 'QUICK' | 'MORNING' | 'SPOT' | 'PARCEL';

export interface IRegisterDestination {
  address: string | null;
  addressDetail: string;
  delivery?: string;
  deliveryMessage?: string;
  deliveryMessageType?: string;
  dong?: string | null;
  main: boolean;
  name: string;
  receiverName?: string;
  receiverTel?: string;
  zipCode: string | null;
}

export interface IAvilabiltyAddress {
  jibunAddress: string | null;
  roadAddress: string | null;
  zipCode: string | null;
  delivery?: TDeliveryType | null;
}

export interface IAvilabiltyAddressResponse {
  code: number;
  message: string;
  data: {
    morning: boolean;
    parcel: boolean;
    quick: boolean;
  };
}

export interface IDestinationsResponse {
  id: number;
  delivery: TDeliveryType;
  deliveryMessage: string;
  deliveryMessageType: string;
  name: string;
  receiverTel: string;
  receiverName: string;
  location: {
    address: string;
    addressDetail: string;
    zipCode: string;
    dong: string;
  };
  main: boolean;
  createdAt: string;
}
export interface IGetDestinationsResponse {
  code: number;
  message: string;
  data: {
    destinations: IDestinationsResponse[];
    pagination: {
      page: number;
      size: number;
      total: number;
      totalPage: number;
    };
  };
}

export interface IGetDestinations {
  page: number;
  size: number;
}

export interface IEditDestination {
  address: string | undefined;
  addressDetail: string | undefined;
  delivery: TDeliveryType | undefined;
  deliveryMessage?: string;
  dong: string | undefined;
  main: boolean;
  name?: string;
  id: number;
  receiverName?: string;
  receiverTel?: string;
  zipCode: string | undefined;
}

export interface IGetMainDestinations {
  delivery: TDeliveryType | null;
}

export interface IGetMainDestinationsResponse {
  code: number;
  message: string;
  data: IDestinationsResponse;
}

export interface IKakaoAddress {
  query: string | null;
  analyze_type?: string;
  page?: number;
  size?: number;
}
export interface IKakaoLatLon {
  x: string;
  y: string;
}

export interface IParamsSpots {
  latitude: number | null;
  longitude: number | null;
  page?: number;
  size?: number;
  keyword?: string;
}

export interface ISpotsResponse {
  code: number;
  message: string;
  data: {
    title: string;
    spots: [
      {
        id: number,
        name: string,
        type: string;
        eventTitle: string;
        images: [
          {
            url: string,
            width: number,
            height: number,
            size: number,
            main: boolean,
          }
        ],
        location: {
          zipCode: string;
          address: string;
          addressDetail: string;
          dong: string;
        };
        coordinate: {
          lat: number;
          lon: number;
        };
        score: number;
        createdAt: string;
        description: string;
        liked: boolean,
        likeCount: number,
        userCount: number,
        distance: number;
        distanceUnit: string;
        lunchDelivery: boolean;
        lunchDeliveryStartTime: string;
        lunchDeliveryEndTime: string;
        dinnerDelivery: string;
        dinnerDeliveryStartTime: string;
        dinnerDeliveryEndTime: string;
        placeType: string;
        isTrial: boolean;
        canEat: boolean;
        canParking: boolean;
        discountRate: number;
        notices: [{
          content: string;
          createdAt: string;
          id: number;
          spotId: number;
        }];
        pickupEndTime: string;
        pickupStartTime: string;
        pickups:[{
          createdAt: string;
          id: number;
          images: [];
          name: string;
          spotId: number;
        }];
        placeHoliday: string;
        placeOpenTime: string;
        stories: [];
      }
    ]
  }
}

export interface ISpots {
  title: string;
  spots: [
    {
      id: number,
      name: string,
      type?: string;
      eventTitle?: string;
      images?: [{
          url?: string,
          width?: number,
          height?: number,
          size?: number,
          main?: boolean,
      }],
      location?: {
        zipCode?: string;
        address?: string;
        addressDetail?: string;
        dong?: string;
      };
      coordinate?: {
        lat?: number;
        lon?: number;
      };
      score?: number;
      createdAt?: string;
      description?: string;
      liked?: boolean,
      likeCount?: number,
      userCount?: number,
      distance?: number;
      distanceUnit?: string;
      lunchDelivery?: boolean;
      lunchDeliveryStartTime?: string;
      lunchDeliveryEndTime?: string;
      dinnerDelivery?: string;
      dinnerDeliveryStartTime?: string;
      dinnerDeliveryEndTime?: string;
      placeType?: string;
      isTrial?: boolean;
      canEat?: boolean;
      canParking?: boolean;
      discountRate?: number;
      notices?: [{
        content?: string;
        createdAt?: string;
        id?: number;
        spotId?: number;
      }];
    pickupEndTime?: string;
      pickupStartTime?: string;
      pickups?:[{
        createdAt?: string;
        id?: number;
        images?: [];
        name?: string;
        spotId?: number;
      }];
      placeHoliday?: string;
      placeOpenTime?: string;
      stories?: [];    
    }
  ]
}

export interface ISpotDetailResponse {
  data: {
    coordinate: {
      lat: number;
      lon: number;
    };
    createdAt: string;
    description: string;
    dinnerDelivery: boolean;
    dinnerDeliveryStartTime: string;
    id: number;
    images: [{
      url: string;
      height: number;
      width: number;
      main: boolean;
      size: number;
    }];
    likeCount: number;
    liked: boolean;
    location: {
      address: string;
      addressDetail: string;
      done: string;
      zipCode: string;
    };
    lunchDelivery: boolean;
    lunchDeliveryStartTime: string;
    name: string;
    notices: [{
      id: number;
      spotId: number;
      content: string;
      createdAt: string;
    }];
    pickupEndTime: string;
    pickupStartTime: string;
    pickups:[{
      createdAt: string;
      id: number;
      images: [];
      name: string;
      spotId: number;
    }];
    placeHoliday: string;
    placeOpenTime: string;
    placeType: string;
    stories: [{
      id: number;
      spotId: number;
      type: string;
      title: string;
      content: string;
      createdAt: string;
      images: [{
        url: string;
      }];
      liked: boolean;
      likeCount: number;    
    }];
    type: string;  
  }
}

export interface ISpotDetailStoriesResponse {
  code: number;
  messages: string;
  data: {
    spotStories: [{
      id: number;
      spotId: number;
      type: string;
      title: string;
      content: string;
      createdAt: string;
      liked: boolean;
      likeCount: number;
      images: [{
        url: string;
        width: string;
        height: string;
        size: string;
      }];  
    }];
    pagination: {
      total: number;
      totalPage: number;
      page: number;
      size: number;
    }
  }
}

// export interface ISpotsInfo {
//   data: {
//     anyRecruitingSpotRegistration: {
//       coordinate: {
//         lat: number;
//         lon: number;
//       };
//       createdAt: string;
//       distance: number;
//       distanceUnit: string;
//       id: number;
//     }
//   }
// }