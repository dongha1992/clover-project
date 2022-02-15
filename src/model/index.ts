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
    spot: boolean;
  };
}

export interface IDestinationsResponse {
  id: number;
  delivery: TDeliveryType;
  deliveryMessage: string;
  deliveryMessageType?: string;
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
  delivery: TDeliveryType | string;
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
  data: ISpots;
}

export interface ISpots {
  title: string;
  spots: [
    {
      id: number;
      name: string;
      type?: string;
      eventTitle: string;
      images: [
        {
          url: string;
          width: number;
          height: number;
          size: number;
          main: boolean;
        }
      ];
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
      liked: boolean;
      likeCount: number;
      userCount: number;
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
      notices: [
        {
          content: string;
          createdAt: string;
          id: number;
          spotId: number;
        }
      ];
      pickupEndTime: string;
      pickupStartTime: string;
      pickups: [
        {
          createdAt: string;
          id: number;
          images: [];
          name: string;
          spotId: number;
        }
      ];
      placeHoliday: string;
      placeOpenTime: string;
      stories: [];
    }
  ];
}

export interface ISpotsDetail {
  coordinate: {
    lat: number;
    lon: number;
  };
  createdAt: string;
  description: string;
  dinnerDelivery: boolean;
  dinnerDeliveryStartTime: string;
  dinnerDeliveryEndTime: string;
  lunchDelivery: boolean;
  lunchDeliveryStartTime: string;
  lunchDeliveryEndTime: string;
  id: number;
  images: [
    {
      url: string;
      height: number;
      width: number;
      main: boolean;
      size: number;
    }
  ];
  likeCount: number;
  liked: boolean;
  location: {
    address: string;
    addressDetail: string;
    done: string;
    zipCode: string;
  };
  name: string;
  notices: [
    {
      id: number;
      spotId: number;
      content: string;
      createdAt: string;
    }
  ];
  pickupEndTime: string;
  pickupStartTime: string;
  pickups: [
    {
      createdAt: string;
      id: number;
      images: [];
      name: string;
      spotId: number;
    }
  ];
  placeHoliday: string;
  placeOpenTime: string;
  placeTel: string;
  placeType: string;
  stories: [
    {
      id: number;
      spotId: number;
      type: string;
      title: string;
      content: string;
      createdAt: string;
      images: [
        {
          url: string;
        }
      ];
      liked: boolean;
      likeCount: number;
    }
  ];
  type: string;
}

export interface ISpotDetailResponse {
  code: number;
  messages: string;
  data: ISpotsDetail;
}

export interface INormalSpots {
  title: string;
  id: number;
  name: string;
  images: [
    {
      url: string;
      width: number;
      height: number;
      size: number;
      main: boolean;
      createdAt: string;
    }
  ];
  image: {
    url: string;
    width: number;
    height: number;
    size: number;
    main: boolean;
    createdAt: string;
  };
  liked: boolean;
  likeCount: number;
  userCount: number;
  distance: number;
  distanceUnit: string;
  eventTitle?: string;
  discountRate?: number;
  recruitingCount: number;
  recruited: boolean;
  placeName: string;
}

export interface ISpotStories {
  id: number;
  spotId: number;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  liked: boolean;
  likeCount: number;
  images: [
    {
      url: string;
      width: string;
      height: string;
      size: string;
    }
  ];
}

export interface ISpotDetailStoriesResponse {
  code: number;
  messages: string;
  data: {
    spotStories: ISpotStories[];
    pagination: {
      total: number;
      totalPage: number;
      page: number;
      size: number;
    };
  };
}

export interface ISpotsInfo {
  spotCount: number;
  unsubmitSpotRegistrations: [
    {
      id: number;
      placeName: string;
      recruitingCount: number;
      orderUserCount: number;
    }
  ];
  recruitingSpotRegistrations: [
    {
      id: number;
      placeName: string;
      recruitingCount: number;
      orderUserCount: number;
    }
  ];
  confirmSpotRegistrations: [
    {
      id: number;
      placeName: string;
      recruitingCount: number;
      orderUserCount: number;
    }
  ];
  trialSpotRegistrations: [];
}

export interface ISpotsInfoResponse {
  code: number;
  message: string;
  data: ISpotsInfo;
}

export interface ISpotRegistrationsResponse {
  data: {
    title: string;
    subTitle: string;
    spotRegistrations: [
      {
        id: number;
        placeName: string;
        image: {
          id: number;
          name: string;
          url: string;
          width: number;
          height: number;
          size: number;
          createdAt: string;
        };
        recruited: boolean;
        recruitingCount: number;
        distance: number;
        distanceUnit: string;
      }
    ];
  };
}

export interface IRegisterCardResponse {
  code: number;
  message: string;
  data: IRegisterCard;
}

export interface IRegisterCard {
  birthDate?: string | null;
  corporationNo?: string | null;
  expiredMM: string;
  expiredYY: string;
  main: boolean;
  name?: string;
  number: string;
  password?: string;
  type: string;
}
export interface IBanners {
  content: string;
  createdAt: string;
  endedAt: string;
  href: string;
  id: number;
  imageHeight: number;
  imageUrl: string;
  imageWidth: number;
  login: boolean;
  option: {
    bgColor: string;
    fontColor: string;
    mobileImageHeight: number;
    mobileImageUrl: string;
    mobileImageWidth: string;
    paths: string[];
  };
  priority: number;
  startedAt: string;
  status: string;
  title: string;
  type: string;
}

export interface IGetBannersResponse {
  code: number;
  message: string;
  data: IBanners[];
}

type BannerType = 'CAROUSEL' | 'CATEGORY' | 'EVENT' | 'EXHIBITION' | 'IMAGE' | 'MENU' | 'ORDER';

export interface IBanner {
  type: string;
}
export interface ITermRequest {
  type: string;
}

export interface ITerm {
  terms: {
    content: string;
    createdAt: string;
    endedAt: string;
    startedAt: string;
    type: string;
    version: number;
  };
  versions: IVersion[];
}

export interface IVersion {
  endedAt: string;
  startedAt: string;
  version: number;
}

export interface ITermResponse {
  code: number;
  message: string;
  data: ITerm;
}

export type TSpotRegisterationsOptiosType = 'PRIVATE' | 'PUBLIC' | 'OWNER';

export interface IParamsSpotRegisterationsOptios {
  type: TSpotRegisterationsOptiosType | string | undefined;
}

export interface ISpotRegisterationsOpstions {
  lunchTimeOptions: [
    {
      name: string;
      value: string;
    }
  ];
  placeTypeOptions: [
    {
      name: string;
      value: string;
    }
  ];
  pickupLocationTypeOptions: [
    {
      name: string;
      value: string;
    }
  ];
}

export interface ISpotRegisterationsOptiosResponse {
  code: number;
  message: string;
  data: ISpotRegisterationsOpstions;
}

export type TSpotPickupType =
  | 'COMMUNAL_FRIDGE'
  | 'COMMUNAL_TABLE'
  | 'DELIVERY_LOCATION'
  | 'DOCUMENT_ROOM'
  | 'ETC'
  | 'FRONT_DESK'
  | 'OFFICE_DOOR';

export type TPlaceType =
  | 'BOOKSTORE'
  | 'CAFE'
  | 'CONVENIENCE_STORE'
  | 'DRUGSTORE'
  | 'ETC'
  | 'FITNESS_CENTER'
  | 'OFFICE'
  | 'SCHOOL'
  | 'SHARED_OFFICE'
  | 'STORE';

type TDistanceUnit =
  | 'CENTIMETERS'
  | 'FEET'
  | 'INCH'
  | 'KILOMETERS'
  | 'METERS'
  | 'MILES'
  | 'MILLIMETERS'
  | 'NAUTICALMILES'
  | 'YARD';

export interface IEditRegistration {
  coordinate: {
    lat: number;
    lon: number;
  };
  location: {
    address?: string | null;
    addressDetail?: string | null;
    dong?: string | null;
    zipCode?: string | null;
  };
  lunchTime?: string;
  pickupType?: TSpotPickupType;
  placeName?: string | null;
  placeType?: TPlaceType;
  placeTypeDetail?: string | null;
  pickupTypeDetail?: string | null;
  type?: TSpotRegisterationsOptiosType | string;
  userEmail: string;
  userName: string;
  userPosition?: string | null;
  userTel: string;
}

export interface IPostRegistrations {
  coordinate: {
    lat: number;
    lon: number;
  };
  createdAt?: string;
  distance?: number;
  distanceUnit?: TDistanceUnit;
  id: number;
  image: {
    createdAt: string;
    height: number;
    id: number;
    name: string;
    originalName: string;
    size: number;
    url: string;
    width: number;
  };
  location: {
    address: string;
    addressDetail: string;
    dong: string;
    zipCode: string;
  };
  lunchTime?: string;
  pickupType?: TSpotPickupType;
  placeName?: string | null;
  placeType?: TPlaceType;
  placeTypeDetail?: string | null;
  pickupTypeDetail?: string | null;
  orderUserCount: number;
  recruited: boolean;
  recruitingCount: number;
  rejected: boolean;
  rejectedAt: string;
  rejectionMessage: string;
  rejectionType: 'ETC' | 'INSUFFICIENCY';
  spotId: number;
  step: 'CONFIRM' | 'OPEN' | 'RECRUITING' | 'TRIAL' | 'UNSUBMIT';
  trialledAt: string;
  type: TSpotRegisterationsOptiosType;
  userEmail: string;
  userId: string;
  userName: string;
  userPosition: string;
  userTel: string;
}

export interface IPostRegistrationResponse {
  code: number;
  message: string;
  data: IPostRegistrations;
}

export interface IGetSpotsRegistrationsStatus {
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPage: number;
  };
  spotRegistrations: [IEditRegistration];
}

export interface IGetSpotsRegistrationsStatusResponse {
  code: number;
  message: string;
  data: IGetSpotsRegistrationsStatus;
}
